$(document).ready(function() {
  var socket = io.connect('http://localhost:8000');
  //ˢ���û������б�
  console.log("chat.js ok");
function flushUsers(users) {
  //���֮ǰ�û��б���� "������" ѡ�Ĭ��Ϊ��ɫѡ��Ч��
  $("#list").empty().append('<li title="˫������" alt="all" class="sayingto" onselectstart="return false">������</li>');
  //���������û������б�
  for (var i in users) {
    $("#list").append('<li alt="' + users[i] + '" title="˫������" onselectstart="return false">' + users[i] + '</li>');
  }
  //˫����ĳ������
  $("#list > li").dblclick(function() {
    //�������˫�����Լ�������
    if ($(this).attr('alt') != from) {
      //���ñ�˫�����û�Ϊ˵������
      to = $(this).attr('alt');
      //���֮ǰ��ѡ��Ч��
      $("#list > li").removeClass('sayingto');
      //����˫�����û����ѡ��Ч��
      $(this).addClass('sayingto');
      //ˢ�����ڶ�˭˵��
      showSayTo();
    }
  });
}
 // var from = $.cookie('user');//�� cookie �ж�ȡ�û��������ڱ��� from
    var from ="sb";
var to = 'all';//����Ĭ�Ͻ��ն���Ϊ"������"
//�����û������ź�
socket.emit('online', {user: from});
socket.on('online', function (data) {
  //��ʾϵͳ��Ϣ
  if (data.user != from) {
    var sys = '<div style="color:#f00">ϵͳ(' + now() + '):' + '�û� ' + data.user + ' �����ˣ�</div>';
  } else {
    var sys = '<div style="color:#f00">ϵͳ(' + now() + '):������������ң�</div>';
  }
  $("#contents").append(sys + "<br/>");
  //ˢ���û������б�
  flushUsers(data.users);
  //��ʾ���ڶ�˭˵��
  showSayTo();
});
socket.on('say', function (data) {
  //��������˵
  if (data.to == 'all') {
    $("#contents").append('<div>' + data.from + '(' + now() + ')�� ������ ˵��<br/>' + data.msg + '</div><br />');
  }
  //��������
  if (data.to == from) {
    $("#contents").append('<div style="color:#00f" >' + data.from + '(' + now() + ')�� �� ˵��<br/>' + data.msg + '</div><br />');
  }
});
//��ʾ���ڶ�˭˵��
function showSayTo() {
  $("#from").html(from);
  $("#to").html(to == "all" ? "������" : to);
}
//��ȡ��ǰʱ��
function now() {
  var date = new Date();
  var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
  return time;
}
//����
$("#say").click(function() {
  //��ȡҪ���͵���Ϣ
  var $msg = $("#input_content").html();
  if ($msg == "") return;
  //�ѷ��͵���Ϣ����ӵ��Լ�������� DOM ��
  if (to == "all") {
    $("#contents").append('<div>��(' + now() + ')�� ������ ˵��<br/>' + $msg + '</div><br />');
  } else {
    $("#contents").append('<div style="color:#00f" >��(' + now() + ')�� ' + to + ' ˵��<br/>' + $msg + '</div><br />');
  }
  //���ͷ�����Ϣ
  socket.emit('say', {from: from, to: to, msg: $msg});
  //�������򲢻�ý���
  $("#input_content").html("").focus();
});
});