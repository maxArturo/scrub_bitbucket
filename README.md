## Bitbucket repo searcher

This hacky script searches through all the BitBucket repos in your account, checks them out into a `temp/` folder and rifles through them in search of a regex of your choice. I used this to quickly search for exposed keys through all my repos. 

If you need to do extensive manipulations, I recommend you use something like [BFG](https://rtyley.github.io/bfg-repo-cleaner/) to help you out. 

### Usage
You must provide a `secrets.json` for your login config to bitbucket. This is ignored by git, be sure it stays that way!

    node scan_repos.js [options] 

You must set up SSH access or register your credentials with git before using this script. If you do not, you can use the `-p` option (below) to use your credential password, but be advised this may leak your plaintext password into the output!

`-p`: ***WARNING*** Uses your included password in `secrets.json` to formulate a one-shot URL to checkout from git. Useful if you don't want to register your credentials with git or haven't set up SSH access. The URL should not leak out if errors occur, but be warned this is not guaranteed!

`--search`: The term or regex you want to search. Uses `'AWS_SECRET_ACCESS_KEY'` by default

`--debug`: Use this to dump your regex and errors into the console. This *WILL* leak your pw if using `-p` above.

