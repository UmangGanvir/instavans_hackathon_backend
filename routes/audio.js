var express = require('express');
var router = express.Router();
var Utils = require('../utils');
var multiparty = require('multiparty');
var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;
var google_speech = require('google-speech');
var cloudconvert = new (require('cloudconvert'))('QParCp1engUIv8LkNxme19atXVg1rW0E0hpoEpjuUvSz9Jpqh8FS5PTyCHzdDkrMNjKWClsrqsWyq2IzgIdJ-A');


router.post('/postAudio', function( req, res, next ){
    console.log("called postAudio",req);
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if(err) res.send({error : err});
        else{
            //
            var localLocation = files[Object.keys(files)[0]][0].path;
            console.log("LCOAL PATH",localLocation);

            

            fs.createReadStream(localLocation)

                .pipe(cloudconvert.convert({
                    inputformat: '3gp',
                    outputformat: 'flac'
                }))
                .pipe(fs.createWriteStream('/Users/maurice/Downloads/out.flac'))
                .on('finish', function() {
                    console.log('Done!');
                    deleteFile(localLocation);
                    google_speech.ASR({
                            developer_key: 'AIzaSyCTrf2a7RcK7rhyy2iI3NZKhkAw18agmp8',
                            file: '/Users/maurice/Downloads/out.flac'
                        }, function(err, httpResponse, xml){
                            if(err){
                                console.log(err);
                            }else{
                                console.log("xml",xml);
                                console.log(httpResponse.statusCode, xml)
                            }
                        }
                    );
                });
            Utils.apiResponse( res, true, {
                score : 100,
                name : "name",
                localLocation : localLocation
            }, 200 );


            // fs.createReadStream('tests/input.pdf').pipe(cloudconvert.convert({
            //     inputformat: '3gp',
            //     outputformat: 'wav'
            //     // converteroptions: {
            //     //     page_range : '1-3',
            //     // }
            // }).on('error', function(err) {
            //     console.error('Failed: ' + err);
            //     //delete from local
            //     deleteFile(localLocation);
            // }).on('finished', function(data) {
            //     console.log('Done: ' + data.message);
            //     //delete from local
            //     deleteFile(localLocation);
            //     this.downloadAll('tests/');
            // }).on('downloaded', function(destination) {
            //     console.log('Downloaded to: ' + destination.path);
            //     //delete from local
            //     deleteFile(localLocation);
            // }).on('downloadedAll', function(path) {
            //     console.log('Downloaded all to: ' + path);
            //     //delete from local
            //     deleteFile(localLocation);
            // }));

            function deleteFile(filename){
                fs.unlink(filename, function(err) {
                    console.log("Deleted local file : "+localLocation);
                });
            }





        }
    });



});

router.get('/postAudio', function( req, res, next ){
    var child = exec("pwd", function (error, stdout, stderr) {
        sys.print('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        console.log("stdout" ,stdout);
    });

    Utils.apiResponse( res, true, {
        score : 100,
        name : "name"
    }, 200 );
});



module.exports = router;
