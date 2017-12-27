

const socket = io ('huuhuynhstreamvideos.herokuapp.com');

$('#div-chat').hide();

socket.on('DANH_SACH_ONLINE' , arrUserInfo => {
    $('#div-chat').show();
    $('#div-dang-ky').hide();
    arrUserInfo.forEach(user => {
        const { ten , peerId} = user;
        $('#ulUser').append(`<li id= "${peerId}">${ten}</li>`);  
    });
    socket.on('CO_NGUOI_DUNG_MOI' , user => {
        const { ten , peerId} = user;
        $('#ulUser').append(`<li id= "${peerId}">${ten}</li>`);
    });
    socket.on ('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAI', () => alert('Vui long dang ky username khac!'));

function openStream(){
    const config = { oudio : false , video : true};
    return navigator.mediaDevices.getUserMedia(config);
}
function playStream (idVideoTag, Stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = Stream;
    video.play();
}
//openStream()
//.then(Stream => playStream('localStream', Stream));

const peer = new Peer({key: 'peerjs' , host: 'mypeer2712.herokuapp.com', secure:true, port: 443});

peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() =>
    {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', {ten: username , peerId : id});
    });
});
//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
    .then(Stream =>{
        playStream('localStream', Stream);
        const call = peer.call(id , Stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream) );
    });
});

//Callee
peer.on('call', call=>{
    openStream()
    .then(Stream=>{
        call.answer(Stream);
        playStream('localStream', Stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream) );
     });
});

$('#ulUser').on('click', 'li', function(){
    const id = $(this).attr('id');
    openStream()
    .then(Stream =>{
        playStream('localStream', Stream);
        const call = peer.call(id , Stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream) );
    });
});
