Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function formatDate(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const dateObj = new Date(date);
    const month = monthNames[dateObj.getMonth()];
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = month + '\n' + day + ', ' + year;


    return output;
}

function drawerClick(element) {
    var items = document.getElementById('drawer').children;
    for (var i = 0; i < items.length; i++) {
        if (items[i].className != 'drawer-item-add' && items[i].className != 'drawer-item-space' && items[i].className != 'horizontal-line')
            items[i].className = "drawer-item";
    }
    element.className = "drawer-item-active";
    if (element.id == 'starred') {
        displayStarredFiles();
    } else if (element.id == 'trash') {
        displayTrashFiles();
    } else if (element.id == 'home') {
        displayFiles();
    } else if (element.id == 'recent') {
        displayRecentFiles();
    } else if (element.id == 'shared') {
        displaySharedFiles();
    }
    if (element.id == 'home') {
        document.getElementsByClassName("file-title-section")[0].style.display = 'flex';
        document.getElementsByClassName("file-head-section")[0].style.marginTop = '0';
        document.getElementsByClassName("file-head-section")[0].style.marginBottom = '2vh';

    } else {
        document.getElementsByClassName("file-title-section")[0].style.display = 'none';
        document.getElementsByClassName("file-head-section")[0].style.marginTop = '2vh';
        document.getElementsByClassName("file-head-section")[0].style.marginBottom = '2vh';
    }
}

function getStorage() {
    var storage;
    var http = new XMLHttpRequest();
    var url = 'http://127.0.0.1/web/php/getStorage.php';
    var params = 'user_id=' + sessionUserId;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            console.log(this.response);
            try{
            document.getElementById('storage-value').innerText = "Storage " + ((parseFloat(this.responseText) / 209715200) * 100).toFixed(0) + "% full";
            document.getElementById('storage-meter').value = ((parseFloat(this.responseText) / 209715200));
            document.getElementById('storage-text').innerText = ((formatBytes(this.responseText) + " of 200 MB used"));
            }catch(e){
                document.getElementById('storage-value').innerText = "Storage " + 0 + "% full";
                document.getElementById('storage-meter').value = 0;
                document.getElementById('storage-text').innerText = (0 + " of 200 MB used");
            }
        }
    }
    http.send(params);
}

function addFolder() {
    var folderName = prompt("Please enter folder name");
    if (folderName != null) {
        var formData = new FormData();
        formData.append("folder_name", folderName);
        formData.append("url", currentFolderUrl);
        formData.append("user_id", sessionUserId);

        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", "http://127.0.0.1/web/php/addFolder.php", true);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var response = this.responseText;
                displayFiles();

                alert("File uploaded successfully");
            }
        };
        xhttp.send(formData);
    }
}

function getIcons(fileType) {
    var iconData = "";
    if (fileType == "application/pdf") {
        iconData = '<i class="far fa-file-pdf" style="color:red;"></i>';
    } else if (fileType == "text/plain") {
        iconData = '<i class="far fa-file-alt" style="color:#105BB1;"></i>';
    } else if (fileType == "application/x-zip-compressed") {
        iconData = '<i class="far fa-file-archive" style="color:brown;"></i>';
    } else if (fileType == "folder") {
        iconData = '<i class="far fa-folder-open" style="color:#ECCB00;"></i>';
    } else if (fileType == "image/png" || fileType == "image/jpeg" || fileType == "image/jpg") {
        iconData = '<i class="far fa-file-image" style="color:#39B40D;"></i>';
    }
    else {
        iconData = '<i class="far fa-file" color = "red"></i>';
    }

    return iconData;
}

function displayFileDetails(file, files, i) {
    var element = document.createElement('h4');
    element.className = "file-item-name";
    element.appendChild(document.createTextNode(files[i]['file_name']));
    file.appendChild(element);

    element = document.createElement('h4');
    element.className = "file-item-type";

    element.appendChild(document.createTextNode(files[i]['file_type']));
    file.appendChild(element);

    element = document.createElement('h4');
    element.className = "file-item-update";
    element.appendChild(document.createTextNode(formatDate(files[i]['updated_at'])));
    file.appendChild(element);


    element = document.createElement('h4');


    element.className = "file-item-size";


    element.appendChild(document.createTextNode(files[i]['file_type'] == 'folder' ? '' : formatBytes(files[i]['size'])));

    file.appendChild(element);
}

function starFile(val, fileId, func) {
    var formData = new FormData();
    formData.append("file_id", fileId);
    formData.append("star_val", val);
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "http://127.0.0.1/web/php/starFile.php", true);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            if (val == "1") {
                alert("You have starred this flie. Click on starred option to see all your starred files.");
            }
            func();

        }
    };

    xhttp.send(formData);
}

function deleteFile(fileId, trashValue, func) {
    var formData = new FormData();
    formData.append("file_id", fileId);
    formData.append("trash_value", trashValue);
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "http://127.0.0.1/web/php/deleteFile.php", true);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var response = this.responseText;

            if (trashValue == '1') {
                alert("The file/folder has been moved to the trash.");
            } else {
                alert("The file/folder is restored to its original destination.");
            }
            func();

        }
    };

    xhttp.send(formData);
}

$(document).ready(function () {
    $("#file").on('change', function () {
        var files = document.getElementById("file").files;

        if (files.length > 0) {

            var formData = new FormData();
            formData.append("file", files[0]);
            formData.append("url", currentFolderUrl);
            formData.append("user_id", sessionUserId);

            var xhttp = new XMLHttpRequest();

            xhttp.open("POST", "http://127.0.0.1/web/php/upload.php", true);

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    displayFiles();

                    alert("File has been uploaded successfully.");
                }
            };

            xhttp.send(formData);
        }
    });
});


function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function showEmpty(type) {
    if (type == 'star') {
        document.getElementsByClassName("file-section")[0].style.display = 'none';
        document.getElementById("file-section-empty").style.display = 'flex';
        document.getElementById("file-section-empty-share").style.display = 'none';
        document.getElementById("file-section-empty-star").style.display = 'block';
        document.getElementById("file-section-empty-trash").style.display = 'none';
        document.getElementById("file-section-empty-default").style.display = 'none';

        document.getElementById("file-section-empty").getElementsByTagName('h1')[0].innerHTML = "No starred files or folders.";
        document.getElementById("file-section-empty").getElementsByTagName('h2')[0].innerHTML = "Add stars to things that you want to easily find later.";
    } else if (type == 'trash') {
        document.getElementsByClassName("file-section")[0].style.display = 'none';
        document.getElementById("file-section-empty").style.display = 'flex';
        document.getElementById("file-section-empty-share").style.display = 'none';
        document.getElementById("file-section-empty-star").style.display = 'none';
        document.getElementById("file-section-empty-trash").style.display = 'block';
        document.getElementById("file-section-empty-default").style.display = 'none';

        document.getElementById("file-section-empty").getElementsByTagName('h1')[0].innerHTML = "No files in trash.";
        document.getElementById("file-section-empty").getElementsByTagName('h2')[0].innerHTML = "You can restore deleted items from here.";
    } else if (type == 'share') {
        document.getElementsByClassName("file-section")[0].style.display = 'none';
        document.getElementById("file-section-empty").style.display = 'flex';
        document.getElementById("file-section-empty-share").style.display = 'block';
        document.getElementById("file-section-empty-star").style.display = 'none';
        document.getElementById("file-section-empty-trash").style.display = 'none';
        document.getElementById("file-section-empty-default").style.display = 'none';

        document.getElementById("file-section-empty").getElementsByTagName('h1')[0].innerHTML = "No shared files.";
        document.getElementById("file-section-empty").getElementsByTagName('h2')[0].innerHTML = "All files shared with you will be displayed here.";
    } else {
        document.getElementsByClassName("file-section")[0].style.display = 'none';
        document.getElementById("file-section-empty").style.display = 'flex';
        document.getElementById("file-section-empty-share").style.display = 'none';
        document.getElementById("file-section-empty-star").style.display = 'none';
        document.getElementById("file-section-empty-trash").style.display = 'none';
        document.getElementById("file-section-empty-default").style.display = 'block';

        document.getElementById("file-section-empty").getElementsByTagName('h1')[0].innerHTML = "This DIBBA is empty.";
        document.getElementById("file-section-empty").getElementsByTagName('h2')[0].innerHTML = "Upload files or add folder to your DIBBA.";
    }
}

function displayFiles() {
    getStorage();
    var files;
    var http = new XMLHttpRequest();
    var url = 'http://127.0.0.1/web/php/getFiles.php';
    var params = 'user_id=' + sessionUserId + '&url=' + currentFolderUrl;
    http.open('POST', url, true);

    var urlArray = currentFolderUrl.split("/");

    document.getElementById("directory-path").childNodes.remove();


    for (var i = 0; i < urlArray.length - 1; i++) {
        var dirList = document.getElementById('directory-path');
        var element = document.createElement('h4');
        if (i == urlArray.length - 2) {
            element.className = "directory-path-item-active";

        } else {
            element.className = "directory-path-item";

        }
        (function (index) {
            element.addEventListener("click", function () {
                var tempUrl = "";
                for (var j = 0; j <= index; j++) {
                    tempUrl += urlArray[j] + "/";
                }
                currentFolderUrl = tempUrl;
                displayFiles();
            })
        })(i)
        if (i != 0) {
            element.appendChild(document.createTextNode(urlArray[i]));
        } else {
            element.appendChild(document.createTextNode("Your Dibba"));

        }
        dirList.appendChild(element);
        var element = document.createElement('h4');
        element.className = "directory-path-sep";
        element.appendChild(document.createTextNode("/"));
        dirList.appendChild(element);
    }


    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    document.getElementsByClassName("file-items").remove();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            if (http.response != '0') {
                files = JSON.parse(http.responseText);
                document.getElementsByClassName("file-section")[0].style.display = 'block';
                document.getElementById("file-section-empty").style.display = 'none';
                var fileList = document.getElementById('file-list-section');
                for (var i = 0; i < files.length; i++) {
                    var file = document.createElement('div');
                    file.className = "file-items";
                    file.innerHTML = getIcons(files[i]['file_type']);

                    if (files[i]['file_type'] != "folder") {
                        (function (index) {
                            file.addEventListener("click", function () {
                                window.open('cloud/' + currentFolderUrl + files[index]['file_name']);
                            })
                        })(i)
                    } else {
                        (function (index) {
                            file.addEventListener("click", function () {
                                currentFolderUrl += files[index]['file_name'] + '/';
                                displayFiles();
                            })
                        })(i)
                    }

                    displayFileDetails(file, files, i);

                    var iconDiv = document.createElement('div');
                    iconDiv.className = "file-item-icons";
                    element = document.createElement('i');
                    if (files[i]['file_type'] != "folder") {
                        if (files[i]['isStarred'] == 0) {
                            element.className = "far fa-star file-item-icon";
                            (function (index) {
                                element.addEventListener("click", function (event) {
                                    event.stopPropagation();
                                    starFile("1", files[index]['file_id'],displayFiles);
                                })
                            })(i)
                        } else {
                            element.className = "fas fa-star file-item-icon";
                            (function (index) {
                                element.addEventListener("click", function (event) {

                                    event.stopPropagation();
                                    starFile("0", files[index]['file_id'],displayFiles);

                                })
                            })(i)

                        }
                        element.style.color = '#FFD700';


                        iconDiv.appendChild(element);
                    }

                    element = document.createElement('i');

                    element.className = "fas fa-user-friends file-item-icon";
                    element.style.color = 'green';
                    element.style.marginLeft = "40px";
                    iconDiv.appendChild(element);

                    (function (index) {
                        element.addEventListener("click", function (event) {
                            event.stopPropagation();
                            var userName = prompt("Please enter user name");
                            var formData = new FormData();
                            formData.append("file_id", files[index]['file_id']);
                            formData.append("user_name", userName);
                            var xhttp = new XMLHttpRequest();
                            xhttp.open("POST", "http://127.0.0.1/web/php/shareFile.php", true);
                            xhttp.onreadystatechange = function () {
                                if (this.readyState == 4 && this.status == 200) {
                                    var response = this.responseText;
                                    alert("You have shared this file/folder with " + userName);
                                    displayFiles(currentFolderUrl);

                                }
                            };
                            xhttp.send(formData);
                        })
                    })(i)

                    element = document.createElement('i');
                    element.className = "fas fa-trash-alt file-item-icon";
                    element.style.color = 'red';
                    element.style.marginLeft = "40px";
                    iconDiv.appendChild(element);

                    (function (index) {
                        element.addEventListener("click", function (event) {
                            event.stopPropagation();
                            deleteFile(files[index]['file_id'], "1", displayFiles);

                        })
                    })(i)

                    file.append(iconDiv);


                    fileList.appendChild(file);

                }
            } else {
                showEmpty('def');

            }
        }
    }
    http.send(params);
}

function displayStarredFiles() {
    var files;
    var http = new XMLHttpRequest();
    var url = 'http://127.0.0.1/web/php/getStarredFiles.php';
    var params = 'user_id=' + sessionUserId;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    document.getElementsByClassName("file-items").remove();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            if (http.response != '0') {
                files = JSON.parse(http.responseText);
                document.getElementsByClassName("file-section")[0].style.display = 'block';
                document.getElementById("file-section-empty").style.display = 'none';

                var fileList = document.getElementById('file-list-section');
                for (var i = 0; i < files.length; i++) {
                    var fileName = files[i]['file_name'];

                    var file = document.createElement('div');
                    file.className = "file-items";
                    file.innerHTML = getIcons(files[i]['file_type']);

                    if (files[i]['file_type'] != "folder") {
                        (function (index) {
                            file.addEventListener("click", function () {
                                window.open('cloud/' + files[index]['file_url'] + files[index]['file_name']);
                            })
                        })(i)
                    } else {
                        file.onclick = () => displayFiles(files[index]['file_url'] + fileName + '/');

                    }

                    displayFileDetails(file, files, i);

                    var iconDiv = document.createElement('div');
                    iconDiv.className = "file-item-icons";
                    element = document.createElement('i');
                    if (files[i]['file_type'] != "folder") {
                        if (files[i]['isStarred'] == 0) {
                            element.className = "far fa-star file-item-icon";
                            (function (index) {
                                element.addEventListener("click", function (event) {
                                    event.stopPropagation();
                                    starFile("1", files[index]['file_id'], displaySharedFiles);

                                })
                            })(i)
                        } else {
                            element.className = "fas fa-star file-item-icon";
                            (function (index) {
                                element.addEventListener("click", function (event) {

                                    event.stopPropagation();
                                    starFile("0", files[index]['file_id'], displayStarredFiles);

                                })
                            })(i)

                        }
                        element.style.color = '#FFD700';


                        iconDiv.appendChild(element);
                    }

                    element = document.createElement('i');

                    element.className = "fas fa-user-friends file-item-icon";
                    element.style.color = 'green';
                    element.style.marginLeft = "40px";
                    iconDiv.appendChild(element);

                    element = document.createElement('i');
                    element.className = "fas fa-trash-alt file-item-icon";
                    element.style.color = 'red';
                    element.style.marginLeft = "40px";
                    iconDiv.appendChild(element);

                    (function (index) {
                        element.addEventListener("click", function (event) {
                            event.stopPropagation();
                            deleteFile(files[index]['file_id'], "1", displayStarredFiles);

                        })
                    })(i)

                    file.append(iconDiv);


                    fileList.appendChild(file);

                }
            } else {
                showEmpty('star');

            }
        }
        else {
            showEmpty('star');
        }
    }
    http.send(params);
}

function displayTrashFiles() {
    var files;
    var http = new XMLHttpRequest();
    var url = 'http://127.0.0.1/web/php/getTrashFiles.php';
    var params = 'user_id=' + sessionUserId;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    document.getElementsByClassName("file-items").remove();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            if (http.response != '0') {
                document.getElementsByClassName("file-section")[0].style.display = 'block';
                document.getElementById("file-section-empty").style.display = 'none';
                files = JSON.parse(http.responseText);
                var fileList = document.getElementById('file-list-section');
                for (var i = 0; i < files.length; i++) {
                    var fileName = files[i]['file_name'];

                    var file = document.createElement('div');
                    file.className = "file-items";
                    file.innerHTML = getIcons(files[i]['file_type']);

                    if (files[i]['file_type'] != "folder") {
                        (function (index) {
                            file.addEventListener("click", function () {
                                window.open('cloud/' + files[index]['file_url'] + files[index]['file_name']);
                            })
                        })(i)
                    } else {
                        file.onclick = () => displayFiles();

                    }

                    displayFileDetails(file, files, i);

                    var iconDiv = document.createElement('div');
                    iconDiv.className = "file-item-icons";
                    element = document.createElement('i');
                    element.className = "fas fa-trash-restore file-item-icon";
                    element.style.color = 'green';

                    (function (index) {
                        element.addEventListener("click", function (event) {
                            event.stopPropagation();
                            deleteFile(files[index]['file_id'], "0", displayTrashFiles);

                        })
                    })(i)

                    iconDiv.appendChild(element);

                    file.append(iconDiv);


                    fileList.appendChild(file);

                }
            }
            else {
                showEmpty('trash');
            }
        }
    }
    http.send(params);
}

function displayRecentFiles() {
    var files;
    var http = new XMLHttpRequest();
    var url = 'http://127.0.0.1/web/php/getRecents.php';
    var params = 'user_id=' + sessionUserId;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    document.getElementsByClassName("file-items").remove();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {

            if (http.response != '0') {
                files = JSON.parse(http.responseText);
                document.getElementsByClassName("file-section")[0].style.display = 'block';
                document.getElementById("file-section-empty").style.display = 'none';
                var fileList = document.getElementById('file-list-section');
                for (var i = 0; i < files.length; i++) {
                    var fileName = files[i]['file_name'];

                    var file = document.createElement('div');
                    file.className = "file-items";
                    file.innerHTML = getIcons(files[i]['file_type']);
                    if (files[i]['file_type'] != "folder") {
                        (function (index) {
                            file.addEventListener("click", function () {
                                window.open('cloud/' + files[index]['file_url'] + files[index]['file_name']);
                            })
                        })(i)
                    } else {
                        file.onclick = () => displayFiles();

                    }

                    displayFileDetails(file, files, i);

                    var iconDiv = document.createElement('div');
                    iconDiv.className = "file-item-icons";
                    element = document.createElement('i');
                    if (files[i]['file_type'] != "folder") {
                        if (files[i]['isStarred'] == 0) {
                            element.className = "far fa-star file-item-icon";
                            (function (index) {
                                element.addEventListener("click", function (event) {
                                    event.stopPropagation();
                                    starFile("1", files[index]['file_id'], displayRecentFiles);
                                })
                            })(i)
                        } else {
                            element.className = "fas fa-star file-item-icon";
                            (function (index) {
                                element.addEventListener("click", function (event) {

                                    event.stopPropagation();
                                    starFile("0", files[index]['file_id'], displayRecentFiles);
                                })
                            })(i)

                        }
                        element.style.color = '#FFD700';


                        iconDiv.appendChild(element);
                    }

                    element = document.createElement('i');

                    element.className = "fas fa-user-friends file-item-icon";
                    element.style.color = 'green';
                    element.style.marginLeft = "40px";
                    iconDiv.appendChild(element);

                    element = document.createElement('i');
                    element.className = "fas fa-trash-alt file-item-icon";
                    element.style.color = 'red';
                    element.style.marginLeft = "40px";
                    iconDiv.appendChild(element);

                    (function (index) {
                        element.addEventListener("click", function (event) {
                            event.stopPropagation();
                            deleteFile(files[index]['file_id'], "1", displayRecentFiles);

                        })
                    })(i)

                    file.append(iconDiv);


                    fileList.appendChild(file);

                }
            }
        }
        else {
            showEmpty('recent');
        }
    }
    http.send(params);
}

function displaySharedFiles() {
    var files;
    var http = new XMLHttpRequest();
    var url = 'http://127.0.0.1/web/php/getSharedFiles.php';
    var params = 'user_id=' + sessionUserId;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    document.getElementsByClassName("file-items").remove();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            console.log(http.response);
            if (http.response != '0') {
                files = JSON.parse(http.responseText);
                document.getElementsByClassName("file-section")[0].style.display = 'block';
                document.getElementById("file-section-empty").style.display = 'none';

                var fileList = document.getElementById('file-list-section');
                for (var i = 0; i < files.length; i++) {
                    var fileName = files[i]['file_name'];

                    var file = document.createElement('div');
                    file.className = "file-items";
                    file.innerHTML = getIcons(files[i]['file_type']);
                    if (files[i]['file_type'] != "folder") {
                        (function (index) {
                            file.addEventListener("click", function () {
                                window.open('cloud/' + files[index]['file_url'] + files[index]['file_name']);
                            })
                        })(i)
                    } else {
                        file.onclick = () => displayFiles(files[index]['file_url'] + fileName + '/');

                    }

                    displayFileDetails(file, files, i);

                    var iconDiv = document.createElement('div');
                    iconDiv.className = "file-item-icons";
                    element = document.createElement('i');
                    if (files[i]['file_type'] != "folder") {
                        if (files[i]['isStarred'] == 0) {
                            element.className = "far fa-star file-item-icon";
                            (function (index) {
                                element.addEventListener("click", function (event) {
                                    event.stopPropagation();
                                    starFile("1", files[index]['file_id'],displaySharedFiles);

                                })
                            })(i)
                        } else {
                            element.className = "fas fa-star file-item-icon";
                            (function (index) {
                                element.addEventListener("click", function (event) {

                                    event.stopPropagation();
                                    starFile("0", files[index]['file_id'], displaySharedFiles);

                                })
                            })(i)

                        }
                        element.style.color = '#FFD700';


                        iconDiv.appendChild(element);
                    }



                    fileList.appendChild(file);

                }
            }
            else {
                showEmpty('share');


            }
        }

    }
    http.send(params);
}

function logout() {
    sessionStorage.clear();
    window.location.href = "login.html";
}

var sessionUserId = sessionStorage.getItem('user_id');
var currentFolderUrl = sessionUserId + '/';
displayFiles(currentFolderUrl);