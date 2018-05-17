import RequestService from "./requestService";
import LoggingService from "./loggingService";
import Constants from "../common/constants";
import AuthService from "./authService";
import SteemService from "./steemService";
import PostService from "./postService";

class CommentService {

	static getComments(postAuthor, postUrl) {
		const url = `post/${postAuthor}${postUrl}/comments`;
		return RequestService.get(url);
	}

	static addComment(postAuthor, parentPermlink, body) {
		const author = AuthService.getUsername();
		const permlink = PostService.createPostPermlink(`${author} comment`);
		const commentObject = {
			parent_author: postAuthor,
			parent_permlink: parentPermlink,
			author: author,
			permlink: permlink,
			title: "",
			body: body,
			json_metadata: {}
		};
		const commentOperation = [Constants.OPERATIONS.COMMENT, commentObject];

		return SteemService.addCommentToBlockchain(commentOperation)
			.then( response => {
				LoggingService.logComment(postAuthor, parentPermlink);
				return Promise.resolve(response);
			})
			.catch( error => {
				LoggingService.logComment(postAuthor, parentPermlink, error);
				return Promise.reject(error);
			});
	}
}

export default CommentService;