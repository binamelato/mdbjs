const bdPlace = "#bForm"; //место под модуль
const bdArea = "dropArea"; //id область дропа
const bdFileButton = "bdFileButton"; //id кнопка выбора файла
const bActiveClass = "-active"; //class активного пользователя
fileData = "";//хранение json строки


function buildDocky(){//построение модуля
	const bdBuildPlace = document.querySelector(bdPlace);
	bdBuildPlace.insertAdjacentHTML("afterbegin",`<div id='${bdArea}'><div id='dropAreaDop'><div>Drop file here</div><div>or</div><div><input id='${bdFileButton}' type='file' value='Select Files'></div></div></div>`);
	
	let dropFileButton = document.querySelector(`#${bdFileButton}`);
	dropFileButton.addEventListener("change", e => {processingFiles(e);});
	dropFileLoad();
}
function processingFiles(e){//выбор файла через кнопку
    const file = e.target.files[0];
	const reader = new FileReader();
    if(!file) return;    
    reader.onload = function(event){
        try{
            const json = JSON.parse(event.target.result);
            createFormСompletion("json", json);
        }catch (error){
            console.error("Ошибка при чтении или парсинге JSON:", error);
        }
    };

    reader.onerror = function(event){
		aMessages("Ошибка",`Ошибка при чтении файла: <div id='errLog'>${event.target.error}</div>`,0,0);
    };
    reader.readAsText(file);
}
function dropFileLoad(){//дроп файла
	const dropArea = document.getElementById(bdArea);	
	
	// Предотвращаем стандартное поведение для событий drag and drop
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
		dropArea.addEventListener(eventName, preventDefaults, false);
	});

	// Обработка события drop
	dropArea.addEventListener('drop', handleDrop, false);
	function preventDefaults(e){
		e.preventDefault();
		e.stopPropagation();			
	}		
	function handleDrop(e){	
		e.preventDefault();	
		const dt = e.dataTransfer;
		const files = dt.files;

		if (files.length){
			const file = files[0];
			const reader = new FileReader();
			reader.onload = function(event){
				try{
					if (file.type === "application/json"){
						// Обработка JSON-файла
						const json = JSON.parse(event.target.result);
						createFormСompletion("json", json);						
					}else{ 
						aMessages("Ошибка","Неподдерживаемый тип файла<div id='errLog'> </div>",0,0);
					}
				}catch(error){
					aMessages("Ошибка",`Ошибка при обработке файла: <div id='errLog'>${error.message}</div>`,0,0);
				}
			};
			reader.readAsText(file);
		}
	}
}
function createFormСompletion(e, data){
	fileData = data;
	const dropPlace = document.getElementById(bdArea);
	dropPlace.innerHTML = "";	
	dropPlace.insertAdjacentHTML("afterbegin", "<div id='leftColumn'><div id='perListHeader'> СПИСОК: </div><div id='perListData'></div><div id='perListButton'><div id='perListAdd'><button><img src='./imgs/add_ico.png'>Add</button></div><div id='perListSave'><button><img src='./imgs/down_ico.png'>Скачать</button></div><div id='chTemplate'><button><img src='./imgs/temple_ico.png'>Шаблон</button></div><div id='perUseDel'><button> Удалить </button></div></div></div><div id='rightColumn'></div>");
	
	tabsData = {
		id: "tabsForm",
		tabsActive: 0,
		howMuch: 2,
		tabsHead0: "КАРТОЧКА",
		tabsBody0: "<div id='perRListData'><div id='rightStatusMess'><div id=''>Выберите из имеющихся</div><div id=''>или</div><div id=''>Нажмите  - [Добавить]</div></div></div><div id='userButt' class='fl'><div id='perUseSave'><button> Изменить </button></div></div>",
		tabsHead1: "ДОКУМЕНТЫ",
		tabsBody1: ""
	}

	tabsModule(tabsData, '#rightColumn');
	
	const addUseButton = document.querySelector("#perListAdd button");
	const saveUselButton = document.querySelector("#perListSave button");
	const d_tarea = document.querySelector("#perListData");
	const editUserInfo = document.querySelector("#perUseSave");
	const delUserInfo = document.querySelector("#perUseDel");
	const templateTable = document.querySelector("#chTemplate");//кнопка изменения шаблона строк
	for(i=0;i<data.users.length;i++){
		var strofa = data.users[i];
		d_tarea.insertAdjacentHTML("beforeend", `<div class="perCard" -id="${i}">${strofa.name.first} ${strofa.name.middle}</div>`);
	}	
	let perListBlockMass = document.querySelectorAll(".perCard");
	perListBlockMass.forEach(elem => {
		elem.addEventListener("click", e => {selectPerData(e, data);});
	});	
	
	addUseButton.addEventListener("click", () => {addPertoList();});
	saveUselButton.addEventListener("click", () => {savePertoList();});
	editUserInfo.addEventListener("click", () => {editPertoList();});
	delUserInfo.addEventListener("click", () => {delPertoList();});
	templateTable.addEventListener("click", () => {templateTableFunc();});
	
}
function selectPerData(e,k){
	let activeYet = document.querySelector(`.${bActiveClass}`);
	let rightPanel = document.querySelector(`#perRListData`);	
	let userButt = document.querySelector(`#userButt`);	
	let userDelButt = document.querySelector(`#perUseDel`);	
	let selectUseName = e.target.textContent;
	if(activeYet){
		if(activeYet.classList.contains(bActiveClass) != e.target.classList.contains(bActiveClass)){
			activeYet.classList.remove(bActiveClass);
			e.target.classList.add(bActiveClass);
			rightPanel.innerHTML = "";	
			addUseInfo(rightPanel, k, selectUseName);
		}else{
			e.target.classList.remove(bActiveClass);
			rightPanel.innerHTML = "";
			rightPanel.innerHTML = "<div id='rightStatusMess'><div id=''>Выберите из имеющихся</div><div id=''>или</div><div id=''>Нажмите  - [Добавить]</div></div></div>";
			userButt.style.display = "none";
			userDelButt.style.display = "none";
		}
	}else{
		e.target.classList.add(bActiveClass);
		rightPanel.innerHTML = "";
		addUseInfo(rightPanel, k, selectUseName);
	}
}
function addUseInfo(e, k, uText){
	let uNameMass = uText.split(" ");
	let datas = k.users.filter(item => item.name.first === uNameMass[0]);
	if(datas.length === 0) return; // Если пользователь не найден — выходим
	
	let user = datas[0];
    let html = '';
	let rightPersBut = document.querySelector(`#userButt`);
	rightPersBut.style.display = "flex";
    let delPersBut = document.querySelector(`#perUseDel`);
	delPersBut.style.display = "block";
    
    for(let key in user){
        if (user.hasOwnProperty(key)){
            renderField(key, user[key]);			
        }
    }
    e.insertAdjacentHTML("beforeend", `<table id='uCardInfo'>${html}</table>`);
	
	function renderField(key, value){
        if(typeof value === 'object' && value !== null && !Array.isArray(value)){
            // Если это объект — рекурсивно обрабатываем его
            for(let subKey in value){
                if(value.hasOwnProperty(subKey)){
                    renderField(subKey, value[subKey]);
                }
            }
        }else{
            // Если это простое значение — добавляем поле ввода
            html += `<tr class="" -key="${key}"><td>${key}</td><td><input class="uPole" value="${value}"></td></tr>`;
        }
    }
}
function addPertoList(){//добавление нового пользователя
	const newUser = {
		status: "active",
		name: {
			first: "",
			middle: "",
			last: ""
		},
		username: "",
		password: "",
		emails: [""],
		phoneNumber: "+79XXXXXXXXX",
		location: {
			street: "",
			city: "",
			state: "",
			country: "Russia",
			zip: ""
		}
	};
	fileData.users.push(newUser);	
	createFormСompletion("json", fileData);
}
function editPertoList(){//сохранение изменений в пользователе
	let userSelectInList = document.querySelector(".-active");
	let paramId = userSelectInList.getAttribute("-id");
	
	let uStatus = document.querySelector("[-key='status']").querySelector("input").value;
	let uFirst = document.querySelector("[-key='first']").querySelector("input").value;
	let uMiddle = document.querySelector("[-key='middle']").querySelector("input").value;
	let uLast = document.querySelector("[-key='last']").querySelector("input").value;
	let uUsername = document.querySelector("[-key='username']").querySelector("input").value;
	let uPassword = document.querySelector("[-key='password']").querySelector("input").value;
	let uEmails = document.querySelector("[-key='emails']").querySelector("input").value;
	let uPhone = document.querySelector("[-key='phoneNumber']").querySelector("input").value;
	let uStreet = document.querySelector("[-key='street']").querySelector("input").value;
	let uCity = document.querySelector("[-key='city']").querySelector("input").value;
	let uState = document.querySelector("[-key='state']").querySelector("input").value;
	let uCountry = document.querySelector("[-key='country']").querySelector("input").value;
	let uZip = document.querySelector("[-key='zip']").querySelector("input").value;
	
	fileData.users[paramId] = {
		status: uStatus,
		name: {
			first: uFirst,
			middle: uMiddle,
			last: uLast
		},
		username: uUsername,
		password: uPassword,
		emails: uEmails,
		phoneNumber: uPhone,
		location: {
			street: uStreet,
			city: uCity,
			state: uState,
			country: uCountry,
			zip: uZip
		}
	};
	createFormСompletion("json", fileData);
}
function savePertoList(){//сохранение в файл
	//aMessages("Уведомление","Данные были обновлены и сохранены<div id='errLog'> </div>",0,0);
	if(fileData != ""){
		saveToJsonFile(fileData);
	}	
}
function delPertoList(){//удаление пользователя
	//aMessages("Уведомление","Данные были обновлены и сохранены<div id='errLog'> </div>",0,0);
	let userSelectInList = document.querySelector(".-active");
	let paramId = userSelectInList.getAttribute("-id");
	fileData.users.splice(paramId, 1);
	createFormСompletion("json", fileData);
}
function templateTableFunc(){//Изменение строк в данных, удаление, добавление и т.д.
	//dPanel("Template",400);
	aMessages("Уведомление","Эта опция пока нереализована<div id='errLog'> </div>",0,0);
}
function dPanel(dName,dWidth){//Доп. панели
	var cssFolder = "./dpanels.css";
	var dMbody = "body";
	var dtxtButtonText = "button";
	var dPanelForm = document.querySelector("#dPanel");
	
	if(!dPanelForm){
		loadCSS(cssFolder);			
		document.body.insertAdjacentHTML('afterbegin',`<div id="dMess"><div id="dMessForm"><div id="dMessFormHead">${dName}</div><div id="dMessFormBody"><div>${dMbody}</div></div><div id="dMessButCloseForm"><input id="dMessFormBodyClose" type="button" value="${dtxtButtonText}"></div></div></div>`);
			
		
		var panelExitBut = document.querySelector('#dMessFormBodyClose');
		if(panelExitBut){
			panelExitBut.addEventListener('click', e => {
				document.querySelector('#dMess').remove();
			});
		}			
	}
}
function aMessages(aMtitle,aMbody,aMtimer,aParam){//Система простых уведомлений
	var cssFolder = "./amessages.css";
	var txtButtonText = "Хорошо";
	//входящие данные:
	// aMtitle - Заголовок окна
	// aMbody - Сообщение на вывод
	// aMtimer - Время до самоудаления алерта в секундах

	var aMessageForm = document.querySelector("#aMess");
	if(!aMessageForm){
		loadCSS(cssFolder);			
		if(aMtimer != 0){
			document.body.insertAdjacentHTML('afterbegin',`<div id="aMess"><div id="aMessForm"><div id="aMessFormHead">${aMtitle}</div><div id="aMessFormBody"><div>${aMbody}</div></div></div></div>`);
			aMtimer = aMtimer*1000;
			setTimeout(() => {document.querySelector('#aMess').remove();}, aMtimer);	
		}else{
			if(aParam == 0){
				document.body.insertAdjacentHTML('afterbegin',`<div id="aMess"><div id="aMessForm"><div id="aMessFormHead">${aMtitle}</div><div id="aMessFormBody"><div>${aMbody}</div></div><div id="aMessButCloseForm"><input id="aMessFormBodyClose" type="button" value="${txtButtonText}"></div></div></div>`);
			}else{
				document.body.insertAdjacentHTML('afterbegin',`<div id="aMess"><div id="aMessForm"><div id="aMessFormHead">${aMtitle}</div><div id="aMessFormBody"><div>${aMbody}</div></div></div></div>`);
			}				
		}
		
		var panelExitBut = document.querySelector('#aMessFormBodyClose');
		if(panelExitBut){
			panelExitBut.addEventListener('click', e => {
				document.querySelector('#aMess').remove();
			});
		}			
	}
}
function loadCSS(href){
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = href;
	document.head.appendChild(link);
}
function tabsModule(tabsData, place){
	const classVisTabHead = "-act";
	const classVisTabPage = "-visible";
	const tabsHeadTab = "tabsHeaderForm";
	const tabsBodyPage = "tabsPagesForm";
	const attributeHeadTab = "tbh-id";
	const attributeBodyTab = "tbb-id";
	const tabsPageHeader = "tabsHeader";
	
	var tabsPlace = document.querySelector(place);
	tabsPlace.insertAdjacentHTML("beforeend",`<div id="${tabsData.id}"><div id="${tabsHeadTab}"></div><div id="${tabsBodyPage}"></div></div>`);
	var tabsHeadTabForm = tabsPlace.querySelector(`#${tabsHeadTab}`);
	var tabsBodyPageForm = tabsPlace.querySelector(`#${tabsBodyPage}`);
	
	for(i=0;i<tabsData.howMuch;i++){
		const headKey = "tabsHead" + i;
		const bodyKey = "tabsBody" + i;
		tabsHeadTabForm.insertAdjacentHTML("beforeend",`<div ${attributeHeadTab}="${i}" class="tabsHeader ">${tabsData[headKey]}</div>`);
		tabsBodyPageForm.insertAdjacentHTML("beforeend",`<div ${attributeBodyTab}="${i}" class="tabsPages ">${tabsData[bodyKey]}</div>`);
		if(i == tabsData.tabsActive){
			document.querySelector(`[${attributeHeadTab}="${i}"]`).classList.add(`${classVisTabHead}`);
			document.querySelector(`[${attributeBodyTab}="${i}"]`).classList.add(`${classVisTabPage}`);
		}
	}
	
	var tabsHeads = document.querySelectorAll(`.${tabsPageHeader}`);
	Array.from(tabsHeads, el => el.addEventListener('click', e => {changeTabStatus(e);}));
	
	function changeTabStatus(e){
		var tempParam = e.target.getAttribute(`${attributeHeadTab}`);
		
		if(document.querySelector(`[${attributeHeadTab}="${tempParam}"]`).classList.contains(classVisTabHead) == true && document.querySelector(`[${attributeBodyTab}="${tempParam}"]`).classList.contains(classVisTabPage) == true){}
		else{
			var removeBlockHead = document.querySelector(`.${classVisTabHead}`);
			var removeBlockBody = document.querySelector(`.${classVisTabPage}`);
			if(removeBlockHead && removeBlockBody){
				removeBlockHead.classList.remove(classVisTabHead);
				removeBlockBody.classList.remove(classVisTabPage);
			}								
			document.querySelector(`[${attributeHeadTab}="${tempParam}"]`).classList.add(classVisTabHead);
			document.querySelector(`[${attributeBodyTab}="${tempParam}"]`).classList.add(classVisTabPage);
		}
	}		
}
function saveToJsonFile(file){		
	t_Data();
	const a = document.createElement("a");
	a.href = URL.createObjectURL(new Blob([JSON.stringify(file, null, 2)], {
		type: "application/json"
	}));
	a.setAttribute("download", `personal_${dd}-${mm}-${yy}_${hh}-${mM}`);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a); 
}
function t_Data(){//Работа с датой
	data = new Date();//получаем объект дата
	dd = data.getDate();//день
	mm = data.getMonth()+1;//месяц
	yy = data.getFullYear();//год в формате хххх 
	hh = data.getHours();//час
	mM = data.getMinutes();//Минуты
	YY = Number(yy.toString().slice(-2));//год в формате хх
	ww = data.getDay();//день недели
}

buildDocky();
