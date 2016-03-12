const bitbucket = require('bitbucket-api');
const url = require('url');
const shell = require('shelljs');
const credentials = require('./secrets.json');
const args = require('minimist')(process.argv.slice(2));
const searchTerms = args.search || 'AWS_SECRET_ACCESS_KEY';
const usePassword = args.p
const debug = args.debug
const checkoutDir = './temp';

const client = bitbucket.createClient(credentials);

const repositories = client.repositories(function(err, repos){
    if (err) {
      console.log(err);
      return;
    }

    var mainUrl = client.getUrl();
    mainUrl = mainUrl.slice(0, mainUrl.length - 4);

    var repoUrls = repos.map(function(repo) {
      repo = url.parse(mainUrl + repo.resource_uri);

      repo = `${repo.protocol}//` +
        `${credentials.username}${usePassword ? ':' + credentials.password : ''}` +
        `@${repo.host.split('.').slice(1).join('.')}/${repo.path.split('/').slice(3).join('/')}.git`;
      return repo;
    });

    repoUrls.forEach(function(repoUrl) {
      const repoName = repoUrl.split('/').slice(-1);

      try {
        if (debug) console.log(`full repo URL: ${repoUrl}`);

        const clone = shell.exec(`git clone ${repoUrl} ${checkoutDir}`, {silent: true});
        if (clone.code !== 0) {
          throw new Error(clone.stderr);
        }

        console.log(`at ${repoName}`);
        const search = shell.exec(`git -C ${checkoutDir} log --all -S"${searchTerms}" --pickaxe-regex`, {silent: true});
        if (search.code !== 0) {
          throw new Error(search.stderr);
        }
        console.log(search.output);
      } catch (e) {
        console.log(`error with repo ${repoName}. Check your credentials, turn on '--debug' and try again. Be aware this will expose your credentials to stdout if using '-p'!`);
        if (debug) console.log(e);
      } finally {
        shell.rm('-rf', checkoutDir);
      }
    });
});

