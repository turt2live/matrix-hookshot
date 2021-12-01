import qs from "querystring";
import { AdminRoomCommandHandler } from "../AdminRoomCommandHandler"
import { botCommand } from "../BotCommands";
import { CommandError } from "../errors";


export function generateGitHubOAuthUrl(clientId: string, redirectUri: string, state: string) {
    const q = qs.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        state: state,
    });
    const url = `https://github.com/login/oauth/authorize?${q}`;
    return url;
}

export class GitHubBotCommands extends AdminRoomCommandHandler {
    @botCommand("github login", "Login to GitHub")
    public async loginCommand() {
        if (!this.config.github) {
            throw new CommandError("no-github-support", "The bridge is not configured with GitHub support");
        }
        const state = this.tokenStore.createStateForOAuth(this.userId);
        return this.sendNotice(`To login, open ${generateGitHubOAuthUrl(this.config.github.oauth.client_id, this.config.github.oauth.redirect_uri, state)} to link your account to the bridge`);
    }

    @botCommand("github startoauth", "Start the OAuth process with GitHub")
    public async beginOAuth() {
        // Legacy command
        return this.loginCommand();
    }
}