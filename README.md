# Hook

This project facilitates the use of git and allows to have a certain security at the time of performing different commands.

Features:

- When you make a merge and then a push to master, beta or staging if the branch you're going to merge does not have a pull request will not allow you to make the push and will inform you of the pull request that you must do.

- Once you have merged a branch and done the push, if all went well to the merged branch will be added the label "merged in master/beta/staging" depending on where you made the merge.


## Requeriments

You should have already installed (with [Homebrew](http://brew.sh) if you're on Mac).

You should have already installed and **running**:

- Node 

## Local Installation

### 1. Node.js version

This repository requires Node.js version 8.15.0, for that we recommend you to use `nvm`.

```bash
brew install nvm
nvm install 8.15.0
nvm use 8.15.0
```

### 2. Clone Github repo in your home

```
cd ~
git clone https://github.com/AlbertHernandez/hook.git
```

### 3. Create Github Token

#### 3.1. Verify your email address, if it hasn't been verified yet.

#### 3.2. In the upper-right corner of any page, click your profile photo, then click Settings.

#### 3.3. In the left sidebar, click Developer settings.

#### 3.4. In the left sidebar, click Personal access tokens.

#### 3.5. Click Generate new token.

#### 3.6. Give your token a descriptive name.

#### 3.7. Select the scopes, or permissions, you'd like to grant this token. To use your token to access repositories from the command line, select repo. (we recommend giving all permissions)

#### 3.8. Click Generate token.

#### 3.9. Click  to copy the token to your clipboard.

### 4. Config your token in the proyect

#### 4.1. Open token file

```
cd git-hooks
open hooks/util/token.js
```

#### 4.2. Paste your Github Token where it says 'PUT HERE YOUR TOKEN';

### 5. Update your hooks

```
rm -r .git/hooks
ln -s ~/git-hooks/hooks .git
```

### Common problems solutions:

If you get into trouble around node modules (because previous installation, or node version upgrade) just:

```
rm -rf node_modules
npm install
```
