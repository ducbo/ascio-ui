const fields =  {
	A: {
		list: [ 'Source', 'TTL' , 'Target'],
		targetDescription: 'IPv4 Address',
		text: "will point to"
	},
	AAAA: {
		list: [ 'Source', 'TTL' , 'Target'],
		targetDescription: 'IPv6 Address',
		text: "will point to"
	},
	CNAME: {
		list: [ 'Source', 'TTL' , 'Target'],
		targetDescription: 'Alias',
		text: "will be an alias of",
		dot: true
	},
	MX: {
		list: [ 'Source', 'TTL', 'Target', 'Priority' ],
		targetDescription: 'Mail server',
		text: "will handle mail exchange for",
		dot: true
	},
	TXT: {
		list: [ 'Source', 'TTL' , 'Target'],
		targetDescription: 'Content',
		text: "will include"
	},
	NS: {
		list: [ 'Source', 'TTL' , 'Target'],
		targetDescription: 'Name Server',
		text: "will be managed by",
		dot: true
	},
	SRV: {
		list: ['Port', 'Priority', 'Weight',  'Source', 'TTL', 'Target' ],
		targetDescription: 'Target',
		text: "will be serviced by",
		dot: true
	},
	SOA: {
		list: [ 'Expire', 'HostmasterEmail',  'PrimaryNameServer', 'Refresh', 'Retry', 'TTL'],
		targetDescription: 'Value',
		text: "will be defined by",
		type: "SOA"
	},
	MailForward: {
		list: [ 'Source', 'TTL' , 'Target'],
		targetDescription: 'Email Address',
		text: "will forward to"
	},
	WebForward: {
		list: [ 'Source', 'TTL', 'Target','RedirectionType' ],
		targetDescription: 'Website URL',
		text: "will redirect to"
	}
};
export default fields