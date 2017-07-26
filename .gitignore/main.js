const socket = io('https://lit-meadow-63274.herokuapp.com/');

socket.on('DANH_SACH_ONLINE',arrUserInfo => {
	arrUserInfo.forEach(user => {
		const {ten, peerId} = user;
		$('#ulUser').append('<li id="${peerId}">${ten}</li>');
	});
	
	socket.on('CO_NGUOI_VUA_DANG_NHAP',user => {
		const {ten, peerId} = user;
		$('#ulUser').append('<li id="${peerId}">${ten}</li>');
	});
});



function openStream(){
	const config = {audio:true,video:true};
	return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag,stream){
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream;
	video.play();
}
//openStream();
//.then(stream => playStream('localStream',stream));
const peer = new Peer({key: 'w9540j89pidaemi'});
peer.on('open',id => {
	$('#my-peer').append(id);
	$('#btnSignUp').click(() => {
		const username = $('#txtUsername').val();
		socket.emit('NGUOI_DUNG_DANG_KY',{ten: username, peerId: id});
	});	
});

$('#btnCall').click(() => {
	const id = $('#remoteId').val();
	openStream()
	.then(stream => {
		playStream('localStream',stream);
		const call = peer.call(id,stream); 
		call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
	});
});
peer.on('call',call => {
	openStream()
	.then(stream => {
		call.answer(stream);
		playStream('localStream',stream);
		call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
	});
});



	