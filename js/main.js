const END_POINT='http://localhost:8080/accounts';

$(function(){
    addAccountListeners();
    loadAllAccounts();
    loadAllDepartmentName();
    addDepartmentListeners();
    loadAllDepartments();
    
});



// Account's Listeners
function addAccountListeners(){

    // select row 
    $('#accounts-tbody').on('click', 'tr', function(event){
        if(event.ctrlKey){
            $(this).toggleClass('selected');
        }else{
            $(this).addClass('selected').siblings().removeClass('selected');
        }
        const selectedRows=$('.selected').length;
        if(selectedRows==0){
            $('#btn-edit').attr('disabled', 'disabled');
            $('#btn-delete').attr('disabled', 'disabled');
        }
        else if(selectedRows==1){
            $('#btn-edit').removeAttr('disabled');
            $('#btn-delete').removeAttr('disabled');
        }
        else{
            $('#btn-edit').attr('disabled', 'disabled');
            $('#btn-delete').removeAttr('disabled');

        }
    });

    //Reload all account when click button refresh
    $('#btn-refresh').on('click', function(event){
        loadAllAccounts();
    });

    //chang page number
    $('#page-number').on('keypress', function(event){
        //13 is key code of Enter button
        if(event.which===13){
            loadAllAccounts();
        }
    });

    //When user select page size
    $('#page-size').on('change', function(event){
        loadAllAccounts();
    });

    //When user click on search button
    $('#btn-search').on('click', function(event){
        
        loadAllAccounts();
    });

    //When user click button create account
    $('#btn-create').on('click', function(event){
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8080/accounts/create-account',
            contentType: 'application/json; charset=utf-8',
            data:JSON.stringify({
                username: $('#create-username').val(),
                firstName: $('#create-firstName').val(),
                lastName: $('#create-lastName').val(),
                password: $('#create-password').val(),
                role: $('#create-role').val(),
                departmentId: $('#create-department').val()
            }),
            success: function(){
                loadAllAccounts();
                $('#create-account-form').trigger("reset");
            }
        });
        bootstrap.Modal.getOrCreateInstance($('#addModal')).hide();
        
    });

    //when user click add button
    $('#btn-add').on('click', function(event){
        const departmentList = $('#create-department');
        departmentList.empty();
        loadAllDepartmentId();
        
    });

    //when user click edit
    $('#btn-edit').on('click', function(event){
        const departmentList = $('#update-department');
        departmentList.empty();
        loadAllDepartmentId();
        const row = $('.selected');
        $('#update-id').val(row.find('.row-id').text());
        $('#update-username').val(row.find('.row-username').text());
        $('#update-fullName').val(row.find('.row-fullName').text());
        $('#update-role').val(row.find('.row-role').text());
        $('#update-department').val(row.find('.row-departmentName').attr('value'));
    });

    //when user click update
    $('#btn-update').on('click', function(event){
        $.ajax({
            method: 'PUT',
            url: 'http://localhost:8080/accounts/update-account/'+$('#update-id').val(),
            contentType: 'application/json; charset=utf-8',
            data:JSON.stringify({
                id: $('#update-id').val(),
                role: $('#update-role').val(),
                departmentId: $('#update-department').val()
            }),
            success: function(){
                loadAllAccounts();
            }
        });
        bootstrap.Modal.getOrCreateInstance($('#updateModal')).hide();

    });

    //when user click delete
    $('#btn-delete').on('click', function(event){
        var selectedRows = $('.selected');
        const message =$('#delete-warning');
        message.text(`Do you want to delete ${selectedRows.length} accounts? `);
        
    });
    
    //when user confirm delete
    $('#btn-confirm-delete').on('click', function(event){
        $.ajax({
            method: 'DELETE',
            url: 'http://localhost:8080/accounts/delete-accounts',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify($('.selected .row-id').toArray().map(id => id.innerText)),
            beforeSend: () => showLoading(),
            success: data => loadAllAccounts(),
            complete: () => hideLoading()
        });
        bootstrap.Modal.getOrCreateInstance($('#deleteModal')).hide();
    });

}
// filter list of accounts
function loadAllAccounts(){
    let role=$('#role').val();
    let departmentName=$('#department').val();
    if(role==-1){
        role=null;
    }
    if(departmentName==-1){
        departmentName=null;
    }
    const params={
        page: $('#page-number').val(),
        size: $('#page-size').val(),
        role: role,
        departmentName: departmentName,
        username : $('#search').val(),
        firstName : $('#search').val(),
        lastName : $('#search').val()

    }
    const searchParams= new URLSearchParams();

    for (const key in params) {
        if(params[key]!=null){
            searchParams.set(key, params[key]);
        }
    }

    $.ajax({
        method: 'GET',
        url: `http://localhost:8080/accounts?${searchParams}`,
        beforeSend: function(){
            showLoading();
        },
        success: function(result){
            showPageInfo(result);
            showAllAccounts(result.content)
        } ,
        complete: function(){
            hideLoading();
        }
    });
    
}

function showPageInfo(result){
    const start = result.pageable.offset;
    $('#page-info').text(`Showing ${start+1} to ${start+result.numberOfElements} of ${result.totalElements} rows.`);
}

// show accounts
function showAllAccounts(accounts){
    const tbody= $('#accounts-tbody');
    tbody.empty();
    for (const account of accounts) {
        tbody.append(`
            <tr>
                <td class="row-id">${account.id}</td>
                <td class="row-username">${account.username}</td>
                <td class="row-fullName">${account.fullName}</td>
                <td class="row-role">${account.role}</td>
                <td class="row-departmentName">${account.departmentName}</td>
            </tr>
        `);
    }
    
}
//  ==========================================Department Method========================================
//Department's Listener

function addDepartmentListeners(){
    // Chon department row
    $('#department-tbody').on('click', 'tr', function(event){
        if(event.ctrlKey){
            $(this).toggleClass('department-selected');
        }else{
            $(this).addClass('department-selected').siblings().removeClass('department-selected');
        }
        const selectedRows=$('.department-selected').length;
        if(selectedRows==0){
            $('#btn-edit-department').attr('disabled', 'disabled');
            $('#btn-delete-department').attr('disabled', 'disabled');
        }
        else if(selectedRows==1){
            $('#btn-edit-department').removeAttr('disabled');
            $('#btn-delete-department').removeAttr('disabled');
        }
        else{
            $('#btn-edit-department').attr('disabled', 'disabled');
            $('#btn-delete-department').attr('disabled', 'disabled');

        }
    });
    //Reload all department when click button refresh
    $('#btn-refresh-department').on('click', function(event){
        loadAllDepartments();
    });

    $('#page-number-department').on('keypress', function(event){
        //13 is key code of Enter button
        if(event.which===13){
            loadAllDepartments();
        }
    });

    //When user select page size
    $('#page-size-department').on('change', function(event){
        loadAllDepartments();
    });

    //When user click on search
    $('#btn-search-department').on('click', function(event){
        loadAllDepartments();
    });


    //When user click create new department
    $('#btn-create-department').on('click', function(event){
        debugger
        $.ajax({

            method: 'POST',
            url: 'http://localhost:8080/departments/add-department',
            contentType: 'application/json; charset=utf-8',
            data:JSON.stringify({
                name: $('#create-department-name').val(),
                type: $('#create-department-type').val(),
                
            }),
            success: function(){
                loadAllDepartments();
                // $('#create-account-form').trigger("reset");
            }
        });
        bootstrap.Modal.getOrCreateInstance($('#addDepartmentModal')).hide();

        
    });

        //when user click edit
    $('#btn-edit-department').on('click', function(event){
        debugger
        const row = $('.department-selected');
        $('#update-department-id').val(row.find('.row-department-id').text());
        $('#update-department-name').val(row.find('.row-department-name').text());
        $('#update-department-type').val(row.find('.row-department-type').text());
        
    });
    $('#btn-update-department').on('click', function(event){
        $.ajax({
            method: 'PUT',
            url: 'http://localhost:8080/departments/update-department/'+$('#update-department-id').val(),
            contentType: 'application/json; charset=utf-8',
            data:JSON.stringify({
                id: $('#update-department-id').val(),
                type: $('#update-department-type').val(),

            }),
            success: function(){
                loadAllDepartments();
            }
        });
        bootstrap.Modal.getOrCreateInstance($('#updateDepartmentModal')).hide();

    });

     //when user click delete
     $('#btn-delete-department').on('click', function(event){
        const message =$('#delete-department-warning');
        message.text(`Do you want to delete these department? `);
        
    });
    
    //when user confirm delete
    $('#btn-confirm-delete-department').on('click', function(event){
        const selectedRows = $('.department-selected');
        $.ajax({
            method: 'DELETE',
            url: 'http://localhost:8080/departments/delete-department?id='+selectedRows.find('.row-department-id').text(),
            success: function(){
                         loadAllDepartments();}
        });
        bootstrap.Modal.getOrCreateInstance($('#deleteDepartmentModal')).hide();
    });
    
}



function showPageInfoDepartment(result){
    const start = result.pageable.offset;
    $('#page-info-department').text(`Showing ${start+1} to ${start+result.numberOfElements} of ${result.totalElements} rows.`);
}


function showLoading(){

}
function hideLoading(){
    
}

function loadAllDepartmentName(){
    $.ajax(
        {
            method: 'GET',
            url: 'http://localhost:8080/departments',
            success: function(result){
                showAllDepartmentsName(result.content);
            }
        }
    );
}

function showAllDepartmentsName(departments){
    debugger
    const select= $('#department');
    for (const department of departments) {
        select.append(`
        <option value="${department.name}">${department.name}</option>
        `);
    }
}
function loadAllDepartmentId(){
    $.ajax(
        {
            method: 'GET',
            url: 'http://localhost:8080/departments',
            success: function(result){
                showAllDepartmentsId(result.content);
            }
        }
    );
}

function showAllDepartmentsId(departments){
    const select= $('#update-department');
    const select2= $('#create-department');
    for (const department of departments) {
        select.append(`
        <option value="${department.id}">${department.name}</option>
        `);
        select2.append(`
        <option value="${department.id}">${department.name}</option>
        `);
    }
}
function loadAllDepartments(){
    let type=$('#filter-type').val();
    const sort= "totalMember,desc"
    if(type==-1){
        type=null;
    }
    const searchDepartmentParams= new URLSearchParams();
    const params ={
        page: $('#page-number-department').val(),
        sort: sort,
        size: $('#page-size-department').val(),
        name: $('#search-department').val(),
        minCreatedDate: $('#min-created-date').val(),
        maxCreatedDate: $('#max-created-date').val(),
        type: type
    }
    for (const key in params) {
        if (params[key]) {
            searchDepartmentParams.set(key, params[key]);
        }
    }
    $.ajax(
        {
            method: 'GET',
            url: 'http://localhost:8080/departments?'+searchDepartmentParams,
            success: function(result){
                showAllDepartments(result.content);
                showPageInfoDepartment(result);
            }
        }
    );
}

function showAllDepartments(departments){
    const select= $('#department-tbody');
    select.empty();
    for (const department of departments) {
        select.append(`
            <tr>
                <td class="row-department-id">${department.id}</td>
                <td class="row-department-name">${department.name}</td>
                <td class="row-department-totalMember">${department.totalMember}</td>
                <td class="row-department-type">${department.type}</td>
                <td class="row-department-createdDate">${department.createDate}</td>
            </tr>
        `);

    }
}

