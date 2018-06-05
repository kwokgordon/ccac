docker stop ccac
docker rm ccac

rm -rf ccac

git clone https://github.com/kwokgordon/ccac.git

docker run -itd --name ccac -p 80:3000 --restart always -v "$PWD":/usr/src/app -w /usr/src/app node:4 node ./ccac/bin/www


