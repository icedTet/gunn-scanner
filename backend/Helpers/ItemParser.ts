import { Assignment, Comment } from "./Types/CourseTypes";
import he from "he";
import showdown from "showdown";
const markupConverter = new showdown.Converter();
import TurndownService from "turndown";
import moment from "moment";
const turndownService = new TurndownService();
turndownService.addRule("iframes", {
  filter: ["iframe"],
  replacement: function (content, node, options) {
    return `!(${(node as HTMLIFrameElement).src})`;
  },
});
turndownService.escape = (str: any) => str;
turndownService.options.blankReplacement = (
  cont: any,
  node: any,
  options: any
) => {
  return node;
};
export class AssignmentParser {
  /**
   *
   * @param {*} assignment
   * @returns {AssignmentPreview}
   */
  static parseSchoologyPreviewAssignment(assignment: {
    id: any;
    title: any;
    document_type: any;
    type: any;
  }) {
    return {
      id: assignment.id,
      title: he.decode(assignment.title),
      type:
        assignment.document_type ||
        (assignment.type !== "document" && assignment.type),
    };
  }
  static parseSchoologyUpcoming(entry: any) {
    return {
      id: entry.assignment_id || entry.id,
      title: he.decode(entry.title),
      type: entry.type,
      due: moment(entry.start, "YYYY-MM-DD HH:mm:ss").toISOString(),
      description: he.decode(
        turndownService.turndown(
          entry.description.replace(/(?:\r\n|\r|\n)/g, "<br />")
        )
      ),
      snowflake: `${entry.section_id}`,
    } as {
      id: string;
      title: string;
      type: string;
      due: string;
      description: string;
      snowflake: string;
    };
  }
  static parseSchoologyGradebookEntry(entry: {
    catagory_id: any;
    assignment_id: any;
    grade: any;
    max_points: any;
    timestamp: number;
  }) {
    return {
      section_id: entry.catagory_id,
      assignment_id: entry.assignment_id,
      grade: entry.grade,
      maxGrade: entry.max_points,
      timestamp: entry.timestamp * 1000,
    };
  }
  static parseSchoologyUpdate(
    update: {
      body: {
        match: (arg0: RegExp) => string[];
        replace: (arg0: RegExp, arg1: string) => string;
      };
      id: any;
      created: number;
      last_updated: number;
      likes: any;
    },
    user: { uid: any; name_display: any; picture_url: any }
  ) {
    let baseURL =
      update.body &&
      update.body.match(/(?=\<base href=\").+(?=\"\/>)/)[0].split('"')[1];
    return {
      id: update.id,
      body: he.decode(
        turndownService.turndown(
          update.body
            .replace(/(?:\r\n|\r|\n)/g, "<br />")
            .replace(/<base .+"\/>/, "")
            .replace(
              /(?:src=[\^"']\/+)[^'"]+/g,
              (value: string) => `src="${baseURL}${value.split('"')[1]}`
            )
        )
      ),
      title: "",
      user: {
        id: user.uid,
        name: he.decode(user.name_display),
        picture: user.picture_url,
      },
      created: update.created * 1000,
      updated: update.last_updated * 1000,
      likes: update.likes,
    };
  }
  static parseSchoologyDiscussionComment(comment: {
    comment: {
      match: (arg0: RegExp) => string[];
      replace: (arg0: RegExp, arg1: string) => string;
    };
    id: any;
    created: number;
    attachments: any;
    likes: any;
    user_like_action: any;
    uid: any;
    user: { name_display: any; picture_url: any };
    children: any;
  }) {
    let baseURL =
      comment.comment &&
      comment.comment
        .match(/(?=\<base href=\").+(?=\"\/>)/)?.[0]
        .split('"')?.[1];
    return {
      id: comment.id,
      comment: turndownService.turndown(
        comment.comment
          .replace(/<base .+"\/>/, "")
          .split("\n\nView on Disadus via\nhttps://disadus.app/app/courses/")[0]
          .replace(/\n/g, "<br />")
          .replace(
            /(?:src=[\^"']\/+)[^'"]+/g,
            (value: string) => `src="${baseURL}${value.split('"')[1]}`
          )
      ),
      created: comment.created * 1000,
      attachments: AssignmentParser.parseSchoologyAttachment(
        comment.attachments
      ),
      likes: comment.likes,
      liked: comment.user_like_action,
      user: {
        id: comment.uid,
        name: comment?.user?.name_display || "Anonymous",
        picture: comment?.user?.picture_url || "https://disadus.app/logo.png",
      },
      children: comment.children || [],
    };
  }
  static parseSchoologyDiscussion(discussion: any, comments: any) {
    let baseURL =
      discussion.body &&
      discussion.body.match(/(?=\<base href=\").+(?=\"\/>)/)[0].split('"')[1];
    return {
      id: `${discussion.id}`,
      title: he.decode(discussion.title),
      grade: -1,
      maxGrade: discussion.max_points,
      parent: discussion.folder_id,
      description: he.decode(
        turndownService.turndown(
          discussion.body
            .replace(/(?:\r\n|\r|\n)/g, "<br />")
            .replace(/<base .+"\/>/, "")
            .replace(
              /(?:src=[\^"']\/+)[^'"]+/g,
              (value: string) => `src="${baseURL}${value.split('"')[1]}`
            )
                        // .replace(
            //   /(?:<iframe src="([^"]+)")[^>]+>.*<\/iframe>/,
            //   (match: any, p1: any) =>
            //     `${match}<br/>Embed url: <a href="${p1}" class="text-blue-500">${p1}</a></div>`
            // )
        )
      ),
      updated: -1,
      attachments: (discussion.body.match(/(?:<iframe src=")[^"]+/g) || [])
        .map((x: string) => ({
          id: x.split('"')[1],
          type: "link",
          title: `Embedded link : ${
            x.split('"')[1].match(/https?:\/\/[^\/]+(\/|$)/)?.[0]
          }`,
          url: x.split('"')[1],
        }))
        .concat(
          AssignmentParser.parseSchoologyAttachment(discussion.attachments)
        ),
      type: "discussion",
      due: discussion.due,
      comments: comments,
    } as Assignment;
  }
  static parseSchoologyFolder(folder: {
    self: { id: any; title: any; color: any };
    parent: { id: any };
    items: any;
  }) {
    return {
      id: folder.self.id,
      title: he.decode(folder.self.title),
      color: folder.self.color,
      parent: folder.parent?.id || null,
      items: folder.items,
    };
  }
  static parseSchoologyAttachment(attachment: {
    links: { link: any[] };
    files: { file: any[] };
  }) {
    let attachments: { id: any; type: string; title: any; url: any }[] = [];
    attachment?.links?.link?.forEach(
      (link: { id: any; title: any; url: any }) => {
        attachments.push({
          id: link.id,
          type: "link",
          title: he.decode(link.title),
          url: link.url,
        });
      }
    );
    attachment?.files?.file?.forEach(
      (file: { id: any; title: any; download_path: any }) => {
        attachments.push({
          id: file.id,
          type: "file",
          title: he.decode(file.title),
          url: file.download_path,
        });
      }
    );

    return attachments;
  }
  static parseSchoologySubmissions(submissions: { revision: any[] }) {
    return (
      submissions?.revision.map(
        (x: {
          revision_id: any;
          created: any;
          attachments: { files: { file: any[] } };
        }) => {
          return {
            revisionID: x.revision_id,
            submitted: x.created,
            files: x.attachments.files.file.map(
              (y: { download_path: any; filename: string }) => ({
                url: y.download_path,
                filename: y.filename,
              })
            ),
          };
        }
      ) || []
    );
  }
  static parseSchoologyRubric(
    rubric: { criteria: any[] },
    rubricData: { criteria_grades: any[] }
  ) {
    const criteriaIDs = new Map();
    rubricData.criteria_grades.forEach((criteria: { criteria_id: any }) => {
      criteriaIDs.set(criteria.criteria_id, criteria);
    });
    return rubric.criteria.map(
      (criteria: { id: any; title: any; description: any; ratings: any[] }) => {
        const criteriaGrade = criteriaIDs.get(criteria.id);
        return {
          title: criteria.title,
          description: criteria.description,
          options: criteria.ratings.map(
            (option: { description: any; points: any }) => ({
              description: option.description,
              points: option.points,
              isSelected: criteriaGrade?.grade === option.points ? true : false,
            })
          ),
          grade: criteriaGrade?.grade || 0,
          comment: criteriaGrade?.comment || "",
        };
      }
    );
  }
  /*
{
  id: 59004445,
  title: 'Claim',
  description: "Precise, nuanced claim that makes an argument about the text's position on a social or philosophical issue",
  max_points: 5,
  weight: 1,
  ratings: [
    { points: 5, description: 'Skilled' },
    { points: 4.4, description: 'Proficient' },
    { points: 3.8, description: 'Approaching' },
    { points: 3, description: 'Emerging' }
  ]
}
  */
  static parseSchoologyAssignment(
    assignment: {
      due: string;
      description: {
        match: (arg0: RegExp) => string[];
        replace: (arg0: RegExp, arg1: string) => string;
      };
      id: any;
      title: any;
      max_points: any;
      type: any;
      folder_id: any;
      items: any;
      last_updated: number;
      attachments: any;
      comments: any;
      web_url: any;
      rubric: any;
    },
    currentGrade: any,
    submissions?: any
  ) {
    let date = assignment?.due?.split("-").map((x: string) => x.split(" ")[0]);

    let baseURL =
      assignment.description &&
      assignment.description
        .match(/(?=\<base href=\").+(?=\"\/>)/)[0]
        .split('"')[1];
    return {
      id: `${assignment.id}`,
      title: he.decode(assignment.title),
      description: he.decode(
        turndownService.turndown(
          assignment.description
            .replace(/(?:\r\n|\r|\n)/g, "<br />")
            .replace(/<base .+"\/>/, "")
            .replace(
              /(?:src=[\^"']\/+)[^'"]+/g,
              (value: string) => `src="${baseURL}${value.split('"')[1]}`
            )
                        // .replace(
            //   /(?:<iframe src="([^"]+)")[^>]+>.*<\/iframe>/,
            //   (match: any, p1: any) =>
            //     `${match}<br/>Embed url: <a href="${p1}" class="text-blue-500">${p1}</a></div>`
            // )
        )
      ),
      due: 9999999999,
      grade: currentGrade,
      maxGrade: assignment.max_points,
      type: assignment.type,
      parent: assignment.folder_id || null,
      items: assignment.items,
      updated: assignment.last_updated * 1000,
      attachments: AssignmentParser.parseSchoologyAttachment(
        assignment.attachments
      ),
      submissions: AssignmentParser.parseSchoologySubmissions(submissions),
      comments: assignment.comments || [],
      link: assignment.web_url,
      rubric: assignment.rubric || [],
    } as Assignment;
  }
  static parseSchoologyPage(page: any) {
    let baseURL = page.body
      .match(/^(?=\<base href=\").+(?=\"\/>)/)[0]
      .split('"')[1];
    return {
      id: `${page.id}`,
      title: he.decode(page.title),
      description: he.decode(
        turndownService.turndown(
          page.body
            .replace(/(?:\r\n|\r|\n)/g, "<br />")
            .replace(/<base .+"\/>/, "")
            .replace(
              /(?:src=[\^"']\/+)[^'"]+/g,
              (value: string) => `src="${baseURL}${value.split('"')[1]}`
            )
                        // .replace(
            //   /(?:<iframe src="([^"]+)")[^>]+>.*<\/iframe>/,
            //   (match: any, p1: any) =>
            //     `${match}<br/>Embed url: <a href="${p1}" class="text-blue-500">${p1}</a></div>`
            // )
        )
      ),
      updated: page.created,
      parent: page.folder_id || null,
      type: "Document",
      attachments: (page.body.match(/(?:<iframe src=")[^"]+/g) || []).map(
        (x: string) => ({
          id: x.split('"')[1],
          type: "link",
          title: `Embedded link : ${
            x.split('"')[1].match(/https?:\/\/[^\/]+(\/|$)/)?.[0]
          }`,
          url: x.split('"')[1],
        })
      ),
    } as Assignment;
  }
}
module.exports = {
  AssignmentParser,
};
/**
 * @typedef {Object} AssignmentPreview
 * @property {string} id
 * @property {string} title
 * @property {string} type
 */
