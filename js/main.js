///доделать класс Post. Не все зн используются. Надо добавить atachmentImages. И сделать разбор принятыых данных где есть картинки и текст
var err;
var ownerId;    //id хозяина приложения  
var getData = undefined;
var isSlided = false;
var timeMenuSlide = 150;
var realMenuSize;
var docWidth = 800;
var link = "";
var typeOfPost;
var elementContent;
var sortedPosts = new Array();
var rawGetData = new Array();
var idOfCurrentUser = undefined;    //id пользователя
var countOfAllPosts= 0;
var displayedPosts = 0;

function Post(image, _postType, postId, postText, _isRepost) {
  this.img = image;
  this.imgDir = "imgs/";
  this.isRepost = _isRepost;
  this.getCssImg = function () {
    if (this.postType == undefined) {
      var str = "url(" + this.imgDir + this.img + ")";
      return str;
    }
    else {
      var str = "url(" + this.img + ")";
      return str;
    }

  }
  this.postType = _postType;
  this.id = postId;
  this.DOMcontent = "";
  this.text = postText;
  this.setImg = function () {
    if (this.postType == undefined)           //если у поста нету картинок то берем картинку с локального хранилища.
      $('#' + this.id).css("background-image", this.imgDir + this.img);
    else
      $('#' + this.id).css("background-image", "url(" + this.imgDir + this.img + ")");
  }
  this.atachmentsImages = new Array();
}


//////////////////////////Win_Load//////////////////////////////
$(window).ready(function () {
  VK.init(onOkInit(), onFaildInit(), '5.52');


  $('#btn').click(function () {
    menuSlide(20);
  });

  $('#start').click(function () {
    clearScr();
    if (isNaN($("#count").val()) != true) var count = $("#count").val();   else {count = 20;$("#count").val(20)};
    if (isNaN($("#offset").val()) != true) var offset = $("#offset").val(); else {offset = 0;$("#offset").val(0)};
    count < 0? count = -count:count = count;
    offset < 0? offset = -offset:offset = offset;
    if (isNaN($("#idOfUSer").val()) != true) idOfCurrentUser = $("#idOfUSer").val(); else {idOfCurrentUser = ownerId;$("#idOfUSer").val("me");};
    
    getAllPosts(count, offset,idOfCurrentUser);
       

   // 
  });

});
///////////////////////////////////////////////////////////////
function getAllPosts(_count,_offset,_id) {
  getCountOfPosts(_id);
  $('#wait').css("background-image","url('imgs/wait.gif')");
  $('#wait').show();
  
  var countInTimer =0;
  var getCount = _count < 0? -_count:_count;
  _count < 0? _count *= -1:_count = _count;
  getCount > countOfAllPosts ? getCount = countOfAllPosts:getCount;
  getCount > 100 ? countInTimer = 100:countInTimer = getCount;
  
  
  var offset = _offset;
  var iteration = Math.ceil(getCount / 100) -1;
  setTimeout(function _get() {
    if (getCount >= 100) { getCount = Math.abs(getCount - 100);} else { countInTimer = getCount; }
    VK.api('wall.get', { 'owner_id':_id,'count': countInTimer, "offset": offset }, function (data) {
      offset = parseInt(offset) + 100;
      rawGetData.push(data.response.items);
      console.log(rawGetData);
      console.log(iteration);
      if (iteration > 0) {
        setTimeout(_get, 500);
        iteration--;
      }
      if(iteration == 0) {displayPosts(rawGetData);$('#wait').hide();}
    });
  }, 500);
}

function displayPosts(rawData) {
  var t_data = Array.from(rawData);
  console.log(typeof(t_data));
  var data = new Array;
 t_data.forEach(function(item,i,t_data) {
    item.forEach(function(item,i,t_data) {
      data.push(item);
    });
  });

    $('#postCount').html("All posts: "+countOfAllPosts);    
    $('#postCountDislpayed').html("On screen "+displayedPosts);
    
    data.forEach(function (element, i, data) {

      var typeOfPost = undefined; //тип поста(текст видео картинка)
      var elementContent;
      var text; //текст поста
      var atchImg = new Array(); //картинки если их больше 1
      var post = undefined;
      var postId = element.id; // id posta
      var atachCount = undefined;
      var isRepost = false;

      try {       //обработка Своих Записей.
        typeOfPost = element.attachments['0'].type;
        elementContent = element.attachments['0'];
        if (element.attachments.length != undefined) atachCount = element.attachments.length;
        switch (typeOfPost) {
          case 'video': link = elementContent.video.photo_130; break;
          case 'photo': link = elementContent.photo.photo_130; break;
          case 'doc': link = "imgs/doc.png";
        }
      } catch (error) { // Если пост является репостом или текстом
        try {

          var elementRoot = element.copy_history['0'].attachments['0'];

          typeOfPost = elementRoot.type;
          switch (typeOfPost) {
            case 'video': link = elementRoot.video.photo_130; break;
            case 'photo': link = elementRoot.photo.photo_130; break;
            case 'doc': link = "imgs/doc.png";

          }
          isRepost = true;
          //if(element.copy_history['0'].atachments.length != undefined) atachCount = element.copy_history['0'].atachments.length;
        } catch (error) {
          link = "txt.png";
          console.log(error);
        }
      }

      post = new Post(link, typeOfPost, postId, text,isRepost);
      sortedPosts.push(post);
      createPost(post);
      // console.log(post.postType + " " + post.getCssImg() + " " + post.id + " " + atachCount);
      if (i == data.length - 1) {
       //при последенем элементе задаем всем собития клика
        $('.post').on('click', function () {
          if(idOfCurrentUser > 0)
          var openLink =  "http://vk.com/id" + idOfCurrentUser + "?w=wall" + idOfCurrentUser + '_' + this.getAttribute('id');
          else
          var openLink = "http://vk.com/wall"+idOfCurrentUser+"?own=1&w=wall"+idOfCurrentUser+"_" + this.getAttribute('id');
          window.open(openLink, '_blank');
          });
        $(".post").on("contextmenu", function (event) {
        var postId = parseInt($(this).attr("id"));
          $('altmenu').hide();
          $('altmenu').css({"left":event.clientX,"top":event.clientY});
          $('#type').html("Type : "+ $(this).attr("typeofpost"));
          $('#repost').html("Repost? : "+ $(this).attr("isrepost"));
          $('altmenu').show(200);
          $(".element").unbind();
          $(".element").on('click', function () {
            $('altmenu').hide();
          });
        });
        $('body').on('mousedown',function () {
          $('altmenu').hide();
        });
      }
      
      if(i % 100 == 0)
      {
        setTimeout(function() {},1090);
      }
    });
}



function createPost(_Post) {
  var createdPost = $('<div>').appendTo('#Posts').attr({ "class": "post", "id": _Post.id,"typeOfPost":_Post.postType,"isRepost": _Post.isRepost});
  createdPost.css("background-image", _Post.getCssImg().toString());
  var postChild = $("<div>").appendTo(createdPost).attr({"id":"num"});
  postChild.html(_Post.id);


}
function clearScr() {
  $('.post').remove();
  sortedPosts = new Array();
  rawGetData = new Array();
  displayedPosts = 0;
}

function menuSlide(maxSlide) {
  isSlided = !isSlided;
  if (!isSlided) {
    $('#leftMenu').animate({
      width: maxSlide + "%",
    }, timeMenuSlide);

    $('#postContent').animate({
      width: 100 - maxSlide + "%",
    }, timeMenuSlide);
  }
  else {
	   $('#leftMenu').animate({
      width: realMenuSize + "%",
    }, timeMenuSlide);
	   $('#postContent').animate({
      width: (100 - realMenuSize) + "%",
    }, timeMenuSlide);
  }
}

function varInit() {

  realMenuSize = ($('#leftMenu').width() / docWidth) * 100; //получаем ширину в процентах
  menuSlide(20);
  $('#postCount').html("All posts: "+countOfAllPosts);
  $('#offset').val("offset");
  $('#count').val("count");
  $('#idOfUSer').val("user's id");
  
  
}

function onOkInit() {
  varInit();
 getCountOfPosts('');
  getUserId();

}

function onFaildInit() {

}

function getCountOfPosts(_id) {
    VK.api('wall.get', {"owner_id":_id}, function (data) {
   try{
     countOfAllPosts = data.response.count;
   }
   catch(error)
   {
     countOfAllPosts = data.response['0'];
   //console.log(data);      
   }
  });
  
}

function getUserId() {
  VK.api('users.get', function (data) {
    if (data.response != undefined) {
      idOfCurrentUser = data.response['0'].uid;
      ownerId = idOfCurrentUser;
    }
    else {
      getUserId();
    }
  });
}