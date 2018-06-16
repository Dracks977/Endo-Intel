sudo apt-get update
sudo apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl status mongodb
npm install
sudo npm install pm2 -g
echo "after editing .env file (C_ID, C_SECRET, CALLBACK) run sudo pm2 start app.js"
echo "after login launch sudo node admin.js [charname]"