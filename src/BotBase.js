class Heart {
	data = {
		op: 1,
		d: null
	};
	step = null;
	resume_url = null;
	base_url = null;
	loop = null;
	socket = null;
	interval = null;
	received = true;
	connecting = false;
	beats = 0;
	initialized = false;
	initializing = false;
	RESUME = {
		op: 6,
		d: {
			token: "",
			session_id: false,
			seq: 0
		}
	};
	IDENTIFY = {
		op: 2,
		d: {
			token: "",
			intents: 513, //102399
			properties: {
				os: "Windows",
				browser: "discript",
				device: "discript"
			}
		}
	}
	Destroy (hard) {
		this.data = {
			op: 1,
			d: null
		};
		this.step = Math.random();
		this.loop = clearInterval(this.loop);
		this.received = true;
		this.beats = 0;
		this.initialized = false;
		this.initializing = false;
		if (hard) {				
			this.resume_url = null;
			this.base_url = null;
			if (this.socket) if (this.socket.readyState === 1) this.socket.close();
			this.socket = null;
			this.interval = null;
		}
		this.connecting = true;
	}
	Seq (seq) {
		this.RESUME.d.seq = seq;
	}
	SessionID (SID) {
		this.RESUME.d.session_id = SID;
	}
	constructor (token, intents = 513) {
		this.IDENTIFY.d.token = token;
		this.RESUME.d.token = token;
		this.IDENTIFY.d.intents = intents;
	}
}
export class Bot {
	HeartBeat = null;
	CachedPayloads = {
		identify: {
		},
		resume: {
			
		}
	};
	queue = [];
	cache = {};
	TOKEN = "";
	INTENTS = 513;
	EventHandler = {};
	async isOnline() { try { const res = await fetch("https://httpbin.org/get"); return res.ok; } catch { return false; } }
	async Sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
	async Connect (reconnect, extra = 1) {
		if (this.HeartBeat) {
			if (this.HeartBeat.connecting) return;
			this.HeartBeat.Destroy(!reconnect);
		} else this.HeartBeat = new Heart(this.TOKEN, this.INTENTS);
		await this.Sleep(5000 * extra);
		this.queue = [];
		while (true) { 
			if (await this.isOnline()) break; 
			await this.Sleep(5000); 
		}
		let url_gateway;
		if (!this.HeartBeat.base_url) {
			const gateway = await fetch('https://discord.com/api/gateway');
			if (!gateway.ok) throw new Error(`HTTP error! status: ${gateway.status}`);
			url_gateway = await gateway.json();
			url_gateway = url_gateway.url;
			this.HeartBeat.base_url = url_gateway;
		} else if (!this.HeartBeat.resume_url) url_gateway = this.HeartBeat.base_url;
		else url_gateway = this.HeartBeat.resume_url;
		url_gateway = url_gateway + "?v=10&encoding=json";
		console.log(url_gateway);
		this.HeartBeat.socket = new WebSocket(url_gateway);
		this.HeartBeat.socket.addEventListener('open', this.OnSocketOpen.bind(this));
		this.HeartBeat.socket.addEventListener('message', this.OnSocketMessage.bind(this));
		this.HeartBeat.socket.addEventListener('close', this.OnSocketClose.bind(this));
		this.HeartBeat.socket.addEventListener('error', this.OnSocketError.bind(this));
	}
	IdentifyBot (step) {
		if (this.HeartBeat.initialized || this.HeartBeat.step !== step || this.HeartBeat.initializing) return;
		if (this.HeartBeat.socket.readyState !== 1) return setTimeout(()=>this.IdentifyBot(step),1000);
		this.HeartBeat.initializing = true;
		if (this.HeartBeat.resume_url) {
			this.HeartBeat.socket.send(JSON.stringify(this.HeartBeat.RESUME));
		} else {
			this.HeartBeat.socket.send(JSON.stringify(this.HeartBeat.IDENTIFY));
		}		
	}
	SendHeartBeat (instant) {
		if (this.HeartBeat.socket.readyState !== 1) return;
		if (this.queue.length > 2) return this.Connect(true);
		if (!this.HeartBeat.received) return this.queue.push(true);
		this.HeartBeat.socket.send(JSON.stringify(this.HeartBeat.data));
		this.HeartBeat.received = false;
	}
	StartHeartBeat (data) {
		if (data.heartbeat_interval) this.HeartBeat.interval = data.heartbeat_interval;
		this.HeartBeat.loop = setInterval(this.SendHeartBeat.bind(this), this.HeartBeat.interval);
		this.SendHeartBeat();
	}
	async Request (url, body, method) {
		try {
			const response = await fetch(`https://discord.com/api/v10/${url}`, {
			  method, // Specify the method
			  headers: {
				  "Authorization": `Bot ${this.TOKEN}`,
				  "User-Agent": "DiscordBot (lee-bot, v1.0.0)",
				"Content-Type": "application/json", // Inform the server the body is JSON
			  },
			  body: JSON.stringify(body), // Convert the JavaScript object to a JSON string
			});

			// Check if the request was successful (status in the 200 range)
			if (!response.ok) {
			  throw new Error(`HTTP error! status: ${response.status}`);
			}
			let responseData = response;
			if (response.body) responseData = await response.json(); // Parse the JSON response body
			console.log("Success:", responseData);
			return responseData;
		} catch (error) {
			console.error("Error:", error);
		}
	}
	async SendGuildMessage (content, channel) {
		await this.Request(`channels/${channel}/messages`, {content}, "POST");
	}
	async ModifyGuildMessage (content, channel, message, method) {
		await this.Request(`channels/${channel}/messages/${message}`, {content}, method);
	}
	async RoleForUser (user, guild, role, method) {
		await this.Request(`guilds/${guild}/members/${user}/roles/${role}`, {}, method); //PUT and DELETE
	}
	async OnSocketOpen (event) {
		this.HeartBeat.connecting = false;
		console.log("open", event);
	}
	OnSocketMessage (event) {
		const data = JSON.parse(event.data);
		console.log("message", data);
		if (typeof data.s === 'number') this.HeartBeat.Seq(data.s);
		if (data.op === 0 && (data.t === "READY" || data.t === "RESUMED")) {
			this.HeartBeat.initialized = true;
			this.cache.ready = data.d;
			if (data.d.resume_gateway_url) this.HeartBeat.resume_url = data.d.resume_gateway_url;
			if (data.d.session_id) this.HeartBeat.SessionID(data.d.session_id);
		}
		if (data.op === 1) this.SendHeartBeat();
		if (data.op === 7) this.Connect(true);
		if (data.op === 9) {
			this.Connect();
		}
		if (data.op === 10) {
			this.StartHeartBeat(data.d);
		}
		if (data.op === 11) {
			this.HeartBeat.received = true;
			this.queue = [];
			if (!this.HeartBeat.initialized) this.IdentifyBot(this.HeartBeat.step);
			this.HeartBeat.beats++;
		}
		if (this.EventHandler[data.t]) this.EventHandler[data.t](data.d);
	}
	OnSocketClose (event) {
		console.log("close", event, event.data, event.code, event.reason);
		this.HeartBeat.connecting = false;
		if (this.HeartBeat.beats < 5) return this.Connect(false, 6-this.HeartBeat.beats);
		if (this.HeartBeat.resume_url) this.Connect(true);
		else return this.Connect();
	}
	OnSocketError(event) {
		this.HeartBeat.connecting = false;
		console.log("error", event, event.data);		
	}
	constructor(token, intents) {
		this.TOKEN = token;
		this.INTENTS = intents;
	}
} 
