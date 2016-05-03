exports.compress = {
	match : /css|js|html/ig
};

exports.expires = {
	match : /^(gig|png|jpg|css|js|html)$/ig,
	maxAge : 60 * 60 * 24 * 365
};