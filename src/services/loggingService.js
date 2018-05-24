import RequestService from "./requestService";
import AuthService from './authService';
import {blockchainErrorsList} from '../utils/blockchainErrorsList';

const loggingUrl = RequestService.getLoggingUrl();

class LoggingService {

	static logLogin() {
		const url = `${loggingUrl}/log/login-with-posting`;
		logCORS(url, 'login');
	}

	static logComment(postAuthor, permlink, error) {
		const url = `${loggingUrl}/log/post/${makePostId(postAuthor, permlink)}/comment`;
		logCORS(url, 'comment', error);
	}

	static logFlag(isFlag, permlink, postAuthor, error) {
		logChangVote(isFlag, permlink, postAuthor, error, 'flag');
	}

	static logVote(isVoteUp, permlink, postAuthor, error) {
		logChangVote(isVoteUp, permlink, postAuthor, error, 'upvote');
	}

	static logPost(error) {
		const url = `${loggingUrl}/log/post`;
		logCORS(url, 'post', error);
	}

	static logEditPost(permlink, error) {
		const url = `${loggingUrl}/log/post/${makePostId(AuthService.getUsername(), permlink)}/edit`;
		logCORS(url, 'edit', error);
	}

	static logFollow(isFollowed, user, error) {
		let fType = (isFollowed) ? 'unfollow' : 'follow';
		const url = `${loggingUrl}/log/user/${user}/${fType}`;
		logCORS(url, fType, error);
	}

	static logDeletedPost(permlink, error) {
		const url = `${loggingUrl}/log/post/${makePostId(AuthService.getUsername(), permlink)}/delete`;
		logCORS(url, 'delete', error);
	}

	static logSharePost(author, permlink) {
		const url = `${loggingUrl}/log/post/${makePostId(author, permlink)}/info`;
		logCORS(url, 'share_post');
	}
}

export default LoggingService;


function logChangVote(isFlag, permlink, postAuthor, error, event) {
	let operation = isFlag ? event : 'downvote';
	const url = `${loggingUrl}/log/post/${makePostId(postAuthor, permlink)}/${operation}`;
	logCORS(url, operation, error);
}

function logCORS(url, operation, error = '') {
	let checkedError = blockchainErrorsList(error);
	const body = {
		username: AuthService.getUsername(),
    checkedError
	};
	const options = {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		headers: {
			'cache-control': 'no-cache',
			'content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	};

	try {
		fetch(url, options)
			.then((response) => {
				if (response.ok && response.status !== 200) {
					notify(`logCORS, ${operation}. Response is OK but something went wrong`, response, true);
				}
			})
			.catch((error) => {
				notify(`logCORS, ${operation}. Error`, error, true);
			});
	}
	catch (error) {
		notify(`logCORS, ${operation}. Catch block`, error, true);
	}
}

function notify(message, response, warn) {
	warn ? console.warn(message) : console.log(message);
}

function makePostId(author, permlink) {
	return `@${author}/${permlink}`;
}