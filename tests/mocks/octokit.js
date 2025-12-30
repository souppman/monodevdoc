const mockGetContent = jest.fn();

class Octokit {
    constructor() {
        this.repos = {
            getContent: mockGetContent
        };
    }
}

module.exports = { Octokit, mockGetContent };
