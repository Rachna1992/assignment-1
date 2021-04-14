function openSongOption(evt, id) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("allsongs");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(id).style.display = "block";
    evt.target.className += " active";
}




var songDetails = new Map();
var albumMap = new Map();
var avaialablePlayList = new Map();
var pageNumber = 1;
var playListDualBox;
var songSearchArr = [];
var searchPageNumber = 1;

function pluginInit() {
    playListDualBox = $('select[name="duallistbox_demo1[]"]').bootstrapDualListbox({
        nonSelectedListLabel: 'Available Songs',
        selectedListLabel: 'Selected Songs',
        preserveSelectionOnMove: 'moved',
        moveAllLabel: 'Move all',
        removeAllLabel: 'Remove all'
    });
    $("#demoform").submit(function(e) {
        if (isPlayListValid()) {
            createMainPlayList();
            resetForm();
        }
        return false;
    });

    var aaSOngs = Array.from(songDetails.values());
    var content;
    for (var i = 0; i < 500; i++) {
        var song = aaSOngs[i];
        var id = song.id.toString;
        playListDualBox.append('<option value=' + song.id + '>' + song.songTitle + '</option>');
    }
    playListDualBox.bootstrapDualListbox('refresh');
}


$(document).ready(function() {
    search();
    $("#songs-container").bind("scroll", attachScrollOnLoad)
    $('#allSongs').click();
});


function attachScrollOnLoad() {
    var end = $("#songs").children().last().offset().top;
    var viewEnd = $("#songs-container").scrollTop() + $("#songs-container").height();
    var distance = end - viewEnd;
    if (distance < 400) {
        console.log("event fired");
        incrementPage();
        console.log("event fired");
    }

}

function attachScrollOnSearch() {
    var end = $("#songs").children().last().offset().top;
    var viewEnd = $("#songs-container").scrollTop() + $("#songs-container").height();
    var distance = end - viewEnd;
    if (distance < 400) {
        console.log("event fired");
        incrementPageSearch();
        console.log("event fired");
    }

}

function incrementPageSearch() {
    searchPageNumber += 1;
    createSongCart(songSearchArr, searchPageNumber);
}

function incrementPage() {
    pageNumber += 1;
    var aaSOngs = Array.from(songDetails.values());
    createSongCart(aaSOngs, pageNumber);
}

function decrementPage() {
    pageNumber -= 1;
    var aaSOngs = Array.from(songDetails.values());
    createSongCart(aaSOngs, pageNumber);
}


function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}





function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}


function createSongCart(allSongs, currentPageNumber) {
    var songs = paginate(allSongs, 8, currentPageNumber);

    let parent = document.getElementById('songs');
    parent.style.display = "block"
    document.getElementById('playListContainer').style.display = "none";
    var content = '<Span>';
    songs.map(function(song) {

        let songOuterDiv = createNode('div');
        songOuterDiv.setAttribute('class', 'songOuterDiv')
        append(parent, songOuterDiv)
        let songImageDiv = createNode('div');
        songImageDiv.setAttribute('class', 'songImageDiv')
        let img = createNode('img');
        img.setAttribute('class', 'songImage')
        img.src = song.url;
        append(songImageDiv, img)
        append(songOuterDiv, songImageDiv)
        let songDetailsDiv = createNode('div');
        songDetailsDiv.setAttribute('class', 'songDetailsDiv')
        append(songOuterDiv, songDetailsDiv)

        let ul = createNode('ul')
        append(songDetailsDiv, ul)
        let albumTitle = song.albumTitle

        let songNameLi = createNode('li');
        songNameLi.innerHTML = "Song Title: " + `${song.songTitle}`;
        let albumNameLi = createNode('li');
        albumNameLi.innerHTML = "Album Title: " + albumTitle;
        let artistNameLi = createNode('li')
        artistNameLi.innerHTML = `Singer: ${song.singers}`;
        let durationLi = createNode('li')
        durationLi.innerHTML = `Play Time: ${song.playTime}`;
        append(ul, songNameLi)
        append(ul, albumNameLi)
        append(ul, artistNameLi)
        append(ul, durationLi)
    })
}

function fetchData(url) {
    return fetch(url)
        .then(function(response) {
            return response.json();
        })
}

function getAllSongs() {
    if (songDetails.size === 0) {
        //to do handel http error codes
        fetchData('https://jsonplaceholder.typicode.com/albums')
            .then(function(albumData) {
                console.log(albumData)
                albumData.map(function(album) {
                    albumMap.set(album.id, album.title);
                })
            })
            .then(function() {
                console.log(albumMap)
                fetchData('https://jsonplaceholder.typicode.com/photos')
                    .then(function(data) {
                        console.log(data)
                        for (var i = 0; i < data.length; i++) {
                            var songObj = {
                                id: data[i].id,
                                singers: "John",
                                url: data[i].url,
                                songTitle: data[i].title,
                                albumTitle: albumMap.get(data[i].albumId),
                                playTime: "5"
                            }
                            songDetails.set(data[i].id, songObj)
                        }
                       var aaSOngs = Array.from(songDetails.values());
                        createSongCart(aaSOngs, pageNumber);
                        if (playListDualBox == undefined) {
                            pluginInit();
                        }
                    $("#search-input").val("");
                    $("#search-results").html("Songs Found:" + songDetails.size);



                    })
            })


            .catch(function(error) {
                console.log(error);
            });
    } else {
        var aaSOngs = Array.from(songDetails.values());
    createSongCart(aaSOngs, pageNumber);
        if (playListDualBox == undefined) {
            pluginInit();
        }
        $("#search-input").val("");
        $("#search-results").html("Songs Found:" + songDetails.size);    }
    
}


function getAllPlayList() {
    var parent = document.getElementById('playListContainer')
    parent.style.display = "block"
    document.getElementById('songs').style.display = "none";
    var playListDiv = createNode('div')

    append(parent, playListDiv);

}

function getSongObj(selectedVals) {
    var songs = []
    for (var i = 0; i < selectedVals.length; i++) {
        var song = songDetails.get(parseInt(selectedVals[i]));
        songs.push(song)
    }
    return songs;
}

function getSongs(playList) {
    var tt = '';
    for (var i = 0; i < playList.length; i++) {
        var song = playList[i];
        tt = tt + '<li class="list-group-item">' + song.songTitle + '</li>'
    }
    return tt;
}


function getInnerSongs(playListName, playList) {

    var ss = '<div class="panel panel-default">' +
        '<div class="panel-heading">' +
        '<h4 class="panel-title">' +
        '<div data-toggle="collapse" class="custom-padding" data-parent="#accordion" href="#' + playListName + '">' +
        '<span>' + playListName + '</span>' +
        ' <span><button style="float: right" type="button" onclick="deletePlayList(' + playListName + ');" class="btn btn-default btn-sm btn-right">' +
        '<span  style="float: right" class="glyphicon glyphicon-trash"></span>' +
        '</button> </span>' +
        '<span style="float: right">' + getCurrentDateAndTime() + '</span>' +
        '</div>'
        +
        '</h4>' +
        '</div>' +
        '<div id="' + playListName + '" class="panel-collapse collapse">' +
        '<ul class="list-group">' +
        getSongs(playList); +
    '</ul>' +
    '</div>' +
    '</div>'
    return ss;
}

function createMainPlayList() {

    var playListName = document.getElementById("playListName").value;
    var error = document.getElementById("error")
    if (playListName === "") {
        error.innerHTML = "<span style='color: red;'>" +
            "Play list name can not be empty</span>"
        console.log("duplicate name")
    } else if (avaialablePlayList.has(playListName)) {
        error.innerHTML = "<span style='color: red;'>" +
            "Play list name already exists</span>"
        console.log("duplicate name")
    } else {
        error.innerHTML = ""
        var selectedVals = $('[name="duallistbox_demo1[]"]').val();
        var songList = getSongObj(selectedVals)
        var newPlayList = {
            createdAt: new Date(),
            playListName: playListName,
            songs: songList
        }
        avaialablePlayList.set(playListName, newPlayList)
        createPlayListHtml(playListName, songList);
    }

}

function createPlayListHtml(playListName, playList) {


    var parent = document.getElementById('playList')

    console.log(playListName + " = " + playList);
    var dd = getInnerSongs(playListName, playList)
    var parent = document.getElementById('accordion')
    parent.insertAdjacentHTML('beforeend', dd);
}

function deletePlayList(element) {
    var playListName = element.id;
    console.log("before del:" + avaialablePlayList.length);
    console.log(element.id);
    avaialablePlayList.delete(playListName);
    console.log("after del:" + avaialablePlayList.length);
    element.parentNode.remove();
}

function shufflePlay() {
    var parent = document.getElementById('accordion');
    removeAllChildNodes(parent);
    for (const [playListName, playList] of avaialablePlayList.entries()) {
        console.log("play:" + playList);
        var child = getInnerSongs(playListName, shuffleArray(playList.songs));
        console.log("eee:" + child)
        parent.insertAdjacentHTML('beforeend', child);
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        // Generate random number 
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


function resetForm() {
    document.getElementById("demoform").reset();
    playListDualBox.bootstrapDualListbox('refresh');
    var error = document.getElementById("error")
    var error1 = document.getElementById("error1")
    error.innerHTML = "";
    error1.innerHTML = "";
}

function isPlayListValid() {
    var playListName = document.getElementById("playListName").value;
    var error = document.getElementById("error")
    var error1 = document.getElementById("error1")
    error.innerHTML = "";
    error1.innerHTML = "";
    var selectedVals = $('[name="duallistbox_demo1[]"]').val();
    if (playListName === "") {
        error.innerHTML = "<p style='color: red;'>" +
            "Play list name can not be empty</p>"
        console.log("duplicate name")
        return false;
    } else if (avaialablePlayList.has(playListName)) {
        error.innerHTML = "<p style='color: red;'>" +
            "Play list name already exists</p>"
        console.log("duplicate name")
        return false;
    } else if (selectedVals == "") {

        error1.innerHTML = "<span style='color: red;'>" +
            "Can not create empty play list, Please select some songs from available list</span>"
        console.log("duplicate name");
        return false;
    } else {
        error.innerHTML = "";
        error1.innerHTML = "";
        return true;
    }
}

function search() {
    $("#search-input").on("keyup", function() {
        var searchFor = $("#search-input").val().toLowerCase();
        if (searchFor === "") {
            $("#songs-container").unbind("scroll", attachScrollOnSearch)
            $("#songs-container").bind("scroll", attachScrollOnLoad)
            var parent = document.getElementById('songs');
            removeAllChildNodes(parent);
            $("#search-results").html("Songs Found:" + songDetails.size);
            pageNumber = 1;
            getAllSongs();
        } else {
            $("#songs-container").unbind("scroll", attachScrollOnLoad)
            songSearchArr = [];
            var results = [];
            var aaSOngs = Array.from(songDetails.values());
            for (var i = 0; i < aaSOngs.length; i++) {
                if (aaSOngs[i].songTitle.toLowerCase().indexOf(searchFor) > -1)
                    results.push(aaSOngs[i]);
            }
            var parent = document.getElementById('songs');
            removeAllChildNodes(parent);
            if (results.length == 0)
                $("#search-results").html("Songs Found: 0");
            else {
                songSearchArr = results;
                searchPageNumber = 1;
                $("#search-results").html("Songs Found:" + results.length);
                $("#songs-container").bind("scroll", attachScrollOnSearch)
                createSongCart(songSearchArr, searchPageNumber);
            }
        }
    });
}


function getCurrentDateAndTime() {
    var today = new Date();
    var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    return dateTime;
}