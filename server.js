const app = require('./app');
const schedule = require('node-schedule'); // 스케쥴

const fs = require('fs');

app.set('port', 3000);

app.listen(app.get('port'), function() {
    console.log('서버에 접속 되었습니다.');
});

//일요일 새벽 4시마다 업데이트 스케쥴
var seoulBikeDataDownload = schedule.scheduleJob('0 4 * * 0,7', function(){
    console.log('The answer to life, the universe, and everything!');
});
