set shiftwidth=4
set expandtab

let b:dispatch="npm run-script build 2>&1 > /dev/null"
au BufWritePost *.jsx :Dispatch!
