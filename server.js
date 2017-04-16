const express = require('express');
const app = express();
const exec = require('child_process').exec;

const port = process.env.PORT || 1234;

app.use(express.static('public'));

app.get('/', (req, res) => {
  exec("arp -a", (error, stdout, stderr) => {
    let stdoutArr = stdout.split('\n');
    stdoutArr.pop();

    let finalJSON = stdoutArr.map((each) => {
      let eachArray = each.split(' ');
      eachArray.splice(2, 1);

      return eachArray.slice(1, 3).reduce((result, item) => {
        if (item.includes(':')) {
          result['MAC_address'] = item;
          return result;

        } else if (item.includes('incomplete')) {
          result['MAC_address'] = 'not found';
          return result;

        } else {
          result['IP_address'] = item.slice(1, item.length - 1);
          return result;
        }
      }, {})
    });
    res.send(finalJSON);
  });
});

app.listen(port, () => {
  console.log(`Opening app on port ${port}`);
});

module.exports = { app };
