///доделать класс Post. Не все зн используются. Надо добавить atachmentImages. И сделать разбор принятыых данных где есть картинки и текст


var err;
var getData = undefined;
var isSlided = false;
var timeMenuSlide = 150;
var realMenuSize;
var docWidth = 800;
var link = "";
var typeOfPost;
var elementContent;
var allPosts = new Array();

function Post(image, _postType, postId, postText) {
  this.img = image;
  this.imgDir = "imgs/";
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

  varInit();

  $('#btn').click(function () {
    menuSlide(20);
  });

  $('#start').click(function () {
    getPosts(30);
  });

});
///////////////////////////////////////////////////////////////


function getPosts(_count) {
  var count = _count > 100 ? count = 100 : count = _count;

  VK.api('wall.get', { 'count': count }, function (data) {
    getData = data.response.items;
    console.log(getData);
    getData.forEach(function (element, i, getData) {

      var typeOfPost = undefined; //тип поста(текст видео картинка)
      var elementContent;
      var text; //текст поста
      var atchImg = new Array(); //картинки если их больше 1
      var post = undefined;
      var postId = element.id; // id posta
      var atachCount = undefined;

      try {       //обработка Своих Записей.
        typeOfPost = element.attachments['0'].type;
        elementContent = element.attachments['0'];
        atachCount = element.attachments.length;        
        switch (typeOfPost) {
          case 'video': link = elementContent.video.photo_130; break;
          case 'photo': link = elementContent.photo.photo_130; break;
        }
      } catch (error) { // Если пост является репостом или текстом
        try {
          var elementRoot = element.copy_history['0'].atachments['0'];
          typeOfPost = elementRoot.type;

          switch (typeOfPost) {
            case 'video': link = elementRoot.video.photo_130; break;
            case 'photo': link = elementRoot.photo.photo_130; break;
          }
        atachCount = element.copy_history['0'].atachments.length;        

        } catch (error) {
          link = "txt.png";

        }
      }

      post = new Post(link, typeOfPost, postId, text);
    
      allPosts.push(post);
      createPost(post);
  console.log(post.postType + " " + post.getCssImg() + " " + post.id + " " + atachCount);
    });

  });
}



function createPost(_Post) {
  var createdPost = $('<div>').appendTo('#postContent').attr({ "class": "post", "id": _Post.id });
  createdPost.css("background-image", _Post.getCssImg().toString());

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
  VK.init(function () { onOkInit(); }, function () { onFaildInit(); }, '5.52');
  realMenuSize = ($('#leftMenu').width() / docWidth) * 100; //получаем ширину в процентах
  menuSlide(20);
}

function onOkInit() {

}

function onFaildInit() {

}