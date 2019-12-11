const sheet = 'https://atf-exprecsv.herokuapp.com/data/1ACUYX48fg2S72zOrNbm1e4CBbRJ8Up32kXwyKjlEWFM/words.json';
const fetch = require('node-fetch');
const fs = require('fs');
fetch(sheet)
    .then(res => res.json())
    .then(json =>{
        console.log('parsing...');
        const data = json.reduce((data, current)=>{
            console.log('.',data);
            Object.keys(data).forEach(key=>{
                if(current[key]!=''){
                    data[key].push(current[key]);
                }
            });
            return data;
        }, {
            timeline:[],
            likelihood:[],
            adjective:[],
            noun:[],
            marketsegment:[]
        });
        fs.writeFileSync(`${process.cwd()}/src/data.json`, JSON.stringify(data))
        console.log('done');
    });
