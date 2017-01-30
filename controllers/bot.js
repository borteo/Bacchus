var _ = require('lodash');
const login = require("facebook-chat-api");


let conversations = [];


// login({email: "penny.1987@ymail.com", password: "SAFADONA87"}

exports.start = ( req, res ) => {
  // Create simple echo bot
  login({email: 'gianni_barba@ymail.com', password: 'penelope'}, function callback(err, api) {
    if ( err ) return console.error(err);

    res.send( "OKAY" );

    api.listen(function callback(err, msg) {
      console.log('message: ', msg);

      const template = [
        'interessante!',
        'okay',
        'oops',
        'internet è lenta... ',
        'internet non va molto bene...scusami.',
        'ti mando un bacio :*',
        'lo sai che mi piaci!',
        'cosa stai facendo?',
        'che cosa romantica!!',
        '?',
        ':)',
        ':D :D :D',
        'i tuoi messaggi arrivano in ritardo',
        ':)',
        ':D',
        '<3',
        '<3 <3 <3',
        ':))))',
        '*_*',
        '...',
        'aspetta un attimo. torno subito...',
        'cosa mi racconti?',
        'non saprei...',
        'non si dice',
      ];

      const replies = [
        'tu cosa dici?',
        'chi lo sa? :D',
        'forse',
        'lo chiedo a te',
        'e tu?',
        'embé?!',
        'non saprei, tu cosa dici?',
        'si',
        'no',
        'non saprei'
      ];

      const hello = [
      'ciao! :D',
      'hello, my dear',
      'ciao <3',
      'saluti caro!'
      ];

      if ( typeof msg === 'undefined' || _.isEmpty( msg ) || msg.type !== 'message') {
        return;
      }

      if ( msg.type === 'sticker' ) {
        setTimeout(function() {
          api.sendMessage(msg.body, msg.threadID);
        }, _.random(1500, 5000));
      }

      if ( !!( msg && msg.body ) === false ) {
        return;
      }

       if ( _.has(msg, 'threadID') === false ) {
        return;
      }

      let message = msg.body.toUpperCase();
      let response = msg.body;
      let index = _.findIndex(conversations, function( convo ) { return convo.threadID == msg.threadID; });

      if ( message.length ) {
        if ( _.includes(message, "CIAO") || _.includes(message, "HELLO") ) {
          response = hello[ _.random(0, hello.length - 1) ];
        } 
        else if ( _.includes(message, "quanti anni") ) {
          response = 'Non si chiede l\'età ad una donna. Tu?';
        }
        else if ( _.includes(message, "dove") ) {
          response = 'Napoli, tu?';
        }
        else if ( _.includes(message, "come va") || _.includes(message, "come stai") ) {
          response = 'Molto bene, e tu?';
        }
        else if ( _.includes(message, "lavoro") ) {
          response = 'Marketing, e tu?';
        }
        else if ( _.includes(message, "?") ) {
          response = replies[ _.random(0, replies.length - 1) ];
        }
        else {
          response = template[ _.random(0, template.length - 1) ];
        } 
        
        
        if ( index >= 0 ) {
          conversations[ index ].messages = conversations[ index ].messages + 1;
          if (conversations[ index ].messages === 6 ) {
            response = 'potresti dare un like alla pagina che mio fratello ed io abbiamo creato? :* https://www.facebook.com/BarbaGianny è un gruppo Facebook di uomini con la barba. :D';
          }
          if ( conversations[ index ].messages === 8 ) {
            response = 'adesso devo andare scusami, ricordati di mettere un like su https://www.facebook.com/BarbaGianny -- se lo fai, prossima volta...sorpresina! ;)';
          }

          if ( conversations[ index ].messages === 9 ) {
            response = 'Vado, un bacione :* <3';
          }

          if ( conversations[ index ].messages > 9 ) {
            return;
          }
        } else {
          conversations.push({threadID: msg.threadID, messages: 1});
        }

      }

      setTimeout(function() {
        let name = '';
        api.getUserInfo(msg.senderID, function(err, ret) {
          if ( err ) return console.error(err); 
          if ( _.random(0, 5) === 3 ) {
            name = ret[msg.threadID].firstName || ret[msg.threadID].vanity || '';
          }

          api.sendTypingIndicator(msg.threadID, function() {
            setTimeout(function() {
              console.log('response: ', response + ' ' + name);
              api.sendMessage(response + ' ' + name, msg.threadID);
            }, _.random(3500, 7500));
          });
        });
      }, _.random(3500, 7500));
    });
  });



};

