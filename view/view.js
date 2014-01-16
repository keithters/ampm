var View = Backbone.View.extend({

	events: {
		'click #update': '_onUpdateClicked',
		'click #restart': '_onRestartClicked'
	},

	_socket: null,

	initialize: function() {
		this._socket = io.connect('http://localhost:3000');
		this._socket.on('appState', _.bind(this._onAppState, this));
	},

	_onAppState: function(message) {
		message.uptime = moment.duration(message.uptime, 'milliseconds').format('dd:hh:mm:ss');
		message.fps = message.fps ? message.fps[message.fps.length - 1] : '';
		message.cpu = message.cpu ? message.cpu[message.cpu.length - 1] : '';
		message.memory = message.memory && message.memory.length ? humanize.filesize(message.memory[message.memory.length - 1]) : '';
		message.logList = '';
		_.each(message.logs, function(log) {
			message.logList += log.level + ': ' + log.msg + '\n';
		});

		message.eventList = '';
		_.each(message.events, function(e) {
			message.eventList += JSON.stringify(e) + '\n';
		});

		var template = _.template($('#info-template').html(), message);
		$('#info').html(template);
	},

	_onUpdateClicked: function() {
		this._socket.emit('updateContent');
	},

	_onRestartClicked: function() {
		this._socket.emit('restart');
	}
});