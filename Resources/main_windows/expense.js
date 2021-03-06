var win = Titanium.UI.currentWindow;
var scrollView = Titanium.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:'auto',
	top:0,
	showVerticalScrollIndicator:true,
	showHorizontalScrollIndicator:true
});
scrollView.layout = 'vertical';

var expenseType, expenseAmount, expenseDate, expenseImagePath = null;

var expenseTypeLabel = Ti.UI.createLabel({
	text: 'Expense Type',
	font: {
		fontSize: 32
	},
	color:'#000',
	width: 'auto',
	height: 'auto',
	left: 5
});
scrollView.add(expenseTypeLabel);

var expenseTypePicker = Ti.UI.createPicker();

var expenseTypeData = [];
expenseTypeData[0]=Ti.UI.createPickerRow({title:'Food',custom_item:'Food'});
expenseTypeData[1]=Ti.UI.createPickerRow({title:'Gas',custom_item:'Gas'});
expenseTypeData[2]=Ti.UI.createPickerRow({title:'Misc',custom_item:'Misc'});

expenseTypePicker.selectionIndicator = true;
expenseTypePicker.add(expenseTypeData);
scrollView.add(expenseTypePicker);
expenseTypePicker.setSelectedRow(0,0,false);



var expenseAmountLabel = Titanium.UI.createLabel({
	text: 'Expense Amount',
	font: {
		fontSize: 32
	},
	color:'#000',
	width: 'auto',
	height: 'auto',
	left: 5
});

scrollView.add(expenseAmountLabel);

var expenseAmountField = Titanium.UI.createTextField({
	width: 'auto',
	height: 'auto',
	left: 5,
	width: 250,
	value: '1.25'
});

scrollView.add(expenseAmountField);



var expenseDateLabel = Ti.UI.createLabel({
	text: 'Expense Date',
	font: {
		fontSize: 32
	},
	color:'#000',
	width: 'auto',
	height: 'auto',
	left: 5
});
scrollView.add(expenseDateLabel);

var minDate = new Date();
minDate.setFullYear(2009);
minDate.setMonth(0);
minDate.setDate(1);

var maxDate = new Date();
maxDate.setFullYear(2012);
maxDate.setMonth(11);
maxDate.setDate(31);

var valueDate = new Date();

var datePicker = Ti.UI.createPicker({
	type: Ti.UI.PICKER_TYPE_DATE,
	minDate: minDate,
	maxDate: maxDate,
	value: valueDate
});
datePicker.selectionIndicator = true;
scrollView.add(datePicker);


var expenseImage = Titanium.UI.createButton({
	title:'Capture Expense Image',
	font: {
		fontSize: 32,
		fontWeight: 'bold'
	},
	width: 'auto',
	height: 'auto',
	top: 5,
	left: 5
});

expenseImage.addEventListener('click', function(){
	Titanium.Media.showCamera({
		success:function(event){
			expenseImagePath = event.media.nativePath;
		},
		saveToPhotoGallery:true,
		allowEditing:false,
		mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
	});
});
scrollView.add(expenseImage);


var submitExpenseButton = Titanium.UI.createButton({
	title: 'Submit Expense',
	font: {
		fontSize: 32,
		fontWeight: 'bold'
	},
	width: 'auto',
	height: 'auto',
	top: 10,
	left: 5
});

submitExpenseButton.addEventListener('click', function(){
	var validateResult, saveResult;
	validateResult = validateExpenseForm();
	if (validateResult === true){
		saveResult = saveExpenseForm();
	}
	if (saveResult === true){
		resetExpenseForm();
	}
});
scrollView.add(submitExpenseButton);

win.add(scrollView);

function validateExpenseForm(){
	var validateVar = true;
	expenseAmount = expenseAmountField.value;
	
	if (expenseAmount == ''){
		validateVar = false;
	}
	
	if (validateVar == true && expenseImagePath == null){
		validateVar = false;
	}
	
	if(validateVar == false){
		alert('The form can not be empty and must have an Expense Image set.');
	}
	return validateVar;
}

function saveExpenseForm(){
	var saveVar, saveMsg;
	try {
		expenseType = expenseTypePicker.getSelectedRow(0),
		expenseAmount = expenseAmountField.value,
		expenseDate = datePicker.value;
		var db = Ti.Database.open('ExpenseTrackerDemo');
		db.execute('INSERT INTO expenses (expenseType, expenseAmount, expenseDate, expenseImageURI) values (?, ?, ?, ?)', expenseType, expenseAmount, String.formatDate(expenseDate, 'medium'), expenseImagePath);
		db.close();
		saveVar = true;
		saveMsg = 'Expense has been added.';
	} catch(e) {
		saveVar = false;
		saveMsg = 'Expense has not been added. Error: '+e;
	}
	alert(saveMsg);
	return saveVar;
}

function resetExpenseForm(){
	expenseTypePicker.setSelectedRow(0,0,false);
	expenseAmountField.value = '1.25';
	var valueDate = new Date();
	datePicker.value = valueDate;
	expenseImagePath = null;
}