(function(){

	'use strict';

	function App() {
		this.totalSeconds = 0;
		this.lastTimestamp = 0;
	}

	App.prototype.init = function() {
		var self = this;
		var insertPlace;
		
		if(insertPlace = document.getElementById('page_header')) {
			insertPlace.parentNode.insertBefore(self.container(), insertPlace);
		}

		chrome.extension.sendMessage(
			{ action: 'loadData' },
			this.load.bind(this)
		);

	}

	App.prototype.container = function() {
		var self = this;
		self.info = document.createElement('span');
		self.info.className = "vk-spend__info";
		self.info.innerHTML = 'Вы онлайн уже:';

		self.span = document.createElement('span');
		self.span.className = "vk-spend__span";
		self.span.innerHTML = 'Пожалуйста, подождите...';

		self.container = document.createElement('div');
		self.container.className = "vk-spend";
		self.container.appendChild(self.info);
		self.container.appendChild(self.span);
		return self.container;
	}

	App.prototype.load = function(data) {
		this.totalSeconds = data.seconds || 0;
		this.lastTimestamp = data.date || this.getTimestamp();
		console.log(this);
		this.track();
		window.setInterval(this.track.bind(this), 1000);
	}

	App.prototype.track = function() {
		var currentTimestamp;

		if( (currentTimestamp = this.getTimestamp()) != this.lastTimestamp ) {
			this.totalSeconds = 0;
		}
		
		this.totalSeconds++;
		this.lastTimestamp = currentTimestamp;
		//console.log(this.totalSeconds);
		this.update();
		chrome.extension.sendMessage({action: 'saveData', seconds: this.totalSeconds, date: this.lastTimestamp});
	}

	App.prototype.update = function() {
		var hours, minutes, seconds;
		
		hours = Math.floor(this.totalSeconds / 3600);
		minutes = Math.floor( (this.totalSeconds - hours*3600) / 60 );
		seconds = this.totalSeconds - minutes*60 - hours*3600;
		
		if( hours < 10 ) hours = "0" + hours;
		if( minutes < 10 ) minutes = "0" + minutes;
		if( seconds < 10 ) seconds = "0" + seconds;
		
		this.span.innerHTML = hours+":"+minutes+":"+seconds;
	}

	App.prototype.getTimestamp = function() {
		var today = new Date();
		var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
		var month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
		var year = today.getFullYear();
		return [day, month, year].join("");
	}

	var app = new App();
	app.init();

})();