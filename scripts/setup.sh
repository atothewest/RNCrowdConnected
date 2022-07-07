#!/bin/sh

YELLOW='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

if which brew &>/dev/null;then
  echo "✅ $(brew --version)"
  echo
else
  echo "${RED}brew not found!${NC}"
  echo
  echo "Download: ${YELLOW}https://brew.sh/${NC}"
  exit
fi

if which node &>/dev/null;then
  echo "✅ Node $(node --version)"
else
  echo "${RED}node not found!${NC} Please install (via a node manager)"
  echo
  echo "nvm: ${YELLOW}https://github.com/nvm-sh/nvm${NC}"
  echo "fnm: ${YELLOW}https://github.com/Schniz/fnm${NC}"
  exit
fi

if which nvm &>/dev/null;then
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

echo 'Installing Node dependencies'
npm install

echo 'Installing iOS dependencies'
(cd ./ios && pod install)

echo 'Installing applesimutils'
brew tap wix/brew
brew install applesimutils

echo
echo "${GREEN}Setup complete!${NC}"
