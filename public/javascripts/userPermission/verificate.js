exports.verificate = (need,user,cb) =>{
	console.log(need)
	if(user[need]){
		cb();
	}
}
