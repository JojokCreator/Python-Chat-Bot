class Chatbox {
  constructor() {
      this.args = {
          openButton: document.querySelector('.chatbox__button'),
          chatBox: document.querySelector('.chatbox__support'),
          sendButton: document.querySelector('.send__button')
      }

      this.state = false;
      this.messages = [];
  }

  display() {
      const {openButton, chatBox, sendButton} = this.args;

      openButton.addEventListener('click', () => this.toggleState(chatBox))

      sendButton.addEventListener('click', () => this.onSendButton(chatBox))

      const node = chatBox.querySelector('input');
      node.addEventListener("keyup", ({key}) => {
          if (key === "Enter") {
              this.onSendButton(chatBox)
          }
      })
  }

  toggleState(chatbox) {
      this.state = !this.state;

      // show or hides the box
      if(this.state) {
          chatbox.classList.add('chatbox--active')
      } else {
          chatbox.classList.remove('chatbox--active')
      }
  }

  onSendButton(chatbox) {
      var textField = chatbox.querySelector('input');
      let text1 = textField.value
      if (text1 === "") {
          return;
      }

      let msg1 = { name: "User", message: text1 }
      this.messages.push(msg1);

      function replaceURLs(message) {
        if(!message) return;
      
        var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        return message.replace(urlRegex, function (url) {
          var hyperlink = url;
          if (!hyperlink.match('^https?:\/\/')) {
            hyperlink = 'http://' + hyperlink;
          }
          return '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
        });
      }

      fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          body: JSON.stringify({ message: text1 }),
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .then(r => r.json())
        .then(r => {
            let msg2 = { name: "Sam", message: r.answer };
            msg2.message = replaceURLs(msg2.message)
            console.log(msg2)
          this.messages.push(msg2);
          this.updateChatText(chatbox)
          this.updateChatBotText(chatbox)
          textField.value = ''

      }).catch((error) => {
          console.error('Error:', error);
          this.updateChatText(chatbox)
          this.updateChatBotText(chatbox)
          textField.value = ''
        });
  }

  updateChatText(chatbox) {
      var html = '';
      this.messages.slice().reverse().forEach(function(item, index) {
          if (item.name === "Sam")
          {   
                html += '<div class="messages__item messages__item--visitor">' + "..." + '</div>'
                
          }
          else
          {
              html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
          }
        });

      const chatmessage = chatbox.querySelector('.chatbox__messages');
        
      chatmessage.innerHTML = html;
    }

  updateChatBotText(chatbox) {
    setTimeout(() => {
      var html = '';
      this.messages.slice().reverse().forEach(function(item, index) {
          if (item.name === "Sam")
          {   
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
                
          }
          else
          {
              html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
          }
        });

      const chatmessage = chatbox.querySelector('.chatbox__messages');
        
      chatmessage.innerHTML = html;
    }, 2000)
    }
}


const chatbox = new Chatbox();
chatbox.display();