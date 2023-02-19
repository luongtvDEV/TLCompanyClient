const END_POINT='http://localhost:8080/accounts';

$(function(){
    addListeners();
    // loadAllDepartmentName();
    loadAllAccounts();
    
});
function addListeners(){
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
        event.preventDefault();
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
                $('#create-form').reset();
            }

        });
    });

    //when user click edit
    $('#btn-edit').on('click', function(event){
        const row = $('.selected');
        debugger
        $('#update-id').val(row.find('.row-id').text());
        $('#update-username').val(row.find('.row-username').text());
        $('#update-fullName').val(row.find('.row-fullName').text());
        $('#update-role').val(row.find('.row-role').text());
        $('#update-department').val(row.find('.row-departmentName').text());

        //chua show duoc department
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
    });

    //when user click delete
    $('#btn-delete').on('click', function(event){
        var selectedRows = $('.selected');
        const message =$('#delete-warning');
        message.text(`Do you want to delete ${selectedRows.length} accounts? `);
        
    });
    
    //when user confirm delete

    $('#btn-confirm-delete').on('click', function(event){
        
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
function showLoading(){

}
function hideLoading(){
    
}

function loadAllDepartmentName(result){
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
    const select= $('#department');
    for (const department of departments) {
        select.append(`
        <option value="${department.name}">${department.name}</option>
        `);
    }
}