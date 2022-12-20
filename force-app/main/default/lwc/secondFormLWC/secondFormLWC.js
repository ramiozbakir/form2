import { LightningElement,api,wire,track } from 'lwc';
import Apex_Method_One_Ref from "@salesforce/apex/C_Sample_Class.m_Insert_A_Contact_Record";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
  
export default class Sample_Customization_Demo extends LightningElement {
    @api a_First_Name_Ref;
    @api a_Last_Name_Ref;
    @api checkValue;
    @api selected_Value;
    @track contacts;

    @track columns = [
        { label: 'First Name', fieldName: 'FirstName', type: 'text', editable: true },
        { label: 'Last Name', fieldName: 'LastName', type: 'text', editable: true },
        { label: 'Gender', fieldName: 'Gender__c', type: 'text' },
        { label: 'Active', fieldName: 'is_Active__c', type: 'boolean' }];

    get options() {
        return [
            { label: '---Select---', value: '' },
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
            { label: 'Others', value: 'Others' }
        ];
    }
  
    handle_First_Name_Change(event) {
        this.a_First_Name_Ref = event.detail.value;
        console.log('checkValue Changed :' + this.a_First_Name_Ref );
    }
  
    handle_Last_Name_Change(event) {
        this.a_Last_Name_Ref = event.detail.value;
        console.log('checkValue Changed :' + this.a_Last_Name_Ref );
    }

    handleCheckChange(event){
        this.checkValue = event.target.checked;
        console.log('checkValue Changed :' + this.checkValue );
    }  
  
    handle_Country_Change(event){
        this.selected_Value = event.detail.value;
        console.log('-=-=: '+ this.selected_Value);
    }
    handleReset(){
        this.template.querySelectorAll('lightning-input').forEach(element => {
          if(element.type === 'checkbox' || element.type === 'checkbox-button'){
            element.checked = false;
          }else if(element.type === 'text'){
            console.log(element.value);
            element.value = null;
          }     
          else{
            console.log(element.value);
            element.value ='';
          }
        });
        this.template.querySelectorAll('lightning-combobox').forEach(element => {
            console.log(element.value);
              element.value = '';
          });
            /* you can also reset one by one by id
                this.template.querySelector('lightning-input[data-id="form"]').value = null; 
                this.template.querySelector('lightning-input[data-id="form"]').checked = false; 
            * */   
      }
    handle_Submit(event){
        // Refering to first method and passwing parameters.
        // Note: a_First_Name, a_Last_Name and a_Email are parameters for the method.
        // all Ref variables are @api references.  
         
        Apex_Method_One_Ref({ 
            a_First_Name : this.a_First_Name_Ref, 
            a_Last_Name : this.a_Last_Name_Ref, 
            a_isActive : this.checkValue, 
            a_Gender : this.selected_Value, 
        })
        .then(result => {
            const event = new ShowToastEvent({
                title: 'Contact created',
                message: 'New Contact '+ this.a_First_Name_Ref +' '+ this.a_Last_Name_Ref +' created successfully.',
                variant: 'success'
            });
            this.dispatchEvent(event);
            let fixeddata = [];
                    let dataline = {};
                    dataline.FirstName = this.a_First_Name_Ref;
                    dataline.LastName = this.a_Last_Name_Ref;
                    dataline.Gender__c = this.selected_Value;
                    dataline.is_Active__c = this.checkValue;
                    fixeddata.push(dataline);
                    console.log(fixeddata);
                this.contacts = fixeddata;
                this.error = undefined;
                this.isLoading = false;
        })
        .catch(error => {
            const event = new ShowToastEvent({
                title : 'Error',
                message : 'Error creating contact. Please Contact System Admin',
                variant : 'error'
            });
            this.dispatchEvent(event);
        });
    }
} 