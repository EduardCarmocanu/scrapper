var request = require('request');
var URI = require('urijs');
var cheerio = require('cheerio');
var fs = require('fs');

var urls = [];

var lineReader = require('readline').createInterface({
  input: fs.createReadStream('urlfile')
});

lineReader.on('line', function(url) {
    urls.push(url);
});

lineReader.on('close', function(){
    console.log('Done!');
    runScript();
});

var runScript = function(){
    urls.forEach(function(url){
        fetchUrl(url);
    });
}

var fetchUrl = function(url){
    request.get(url, function (err, res, body) { 
        const $ = cheerio.load(body);
        var contact = [];

        if($('.member-banner .member .social-links a').length > 0){
            $('.member-banner .member .social-links a:not([class])').each(function(index, element){
                if(element.attribs.href){
                    // if(element.attribs.href.indexOf('mailto:') == 0){
                        contact.push(element.attribs.href);
                    // }

                    // if(element.attribs.href.indexOf('tel:') == 0){
                    //     contact.push(element.attribs.href);
                    // }
                }
            });
        }
        fs.appendFile("url_output.txt", contact + "\t\n", function(err) {
            if (err) {
                return console.log(err)
            }
        });
        console.log(contact);
    });
}
