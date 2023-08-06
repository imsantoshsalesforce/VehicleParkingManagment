
public with sharing class VehicleCategoryController {

    // public VehicleCategoryController() {

    // }

    // @AuraEnabled(cacheable=true)
    // public static List<Account> getAccount(){
    //     List<Account> accList = [SELECT Id, Name, Industry, Website, Phone from Account LIMIT 5];
    //     return accList;
    // }

    @AuraEnabled(cacheable=true)
    public static List<Vehicle_Category__c> getVehicleCategory(){
        List<Vehicle_Category__c> vehicleCatList = [SELECT Name, vehicle_category__c, short_description__c, LastModifiedDate FROM Vehicle_Category__c];
        return vehicleCatList;
    }

    // @AuraEnabled
    // public static Vehicle_Category__c insertVehicleCategory(){ 
    //     // System.debug('First value :'+catName);
    //     // System.debug('Second value :'+description);

    //     try{
    //         Vehicle_Category__c vCat = new Vehicle_Category__c(
    //             vehicle_category__c = 'Eight Wheeler' ,
    //             short_description__c = 'Truck long'
    //         );
    //         insert vCat;
    //         return vCat;
    //     }catch(Exception e){
    //         System.debug(e.getMessage());
    //     }
    //     return null;
    // }

    @AuraEnabled    
    public static String insertVehicleCategory(String payload){ 

        VehicleCategory payloadObject = (VehicleCategory) JSON.deserialize(payload, VehicleCategory.class);

        SObject category = (Sobject) Type.forName('Vehicle_Category__c').newInstance();
        category.put('vehicle_category__c', payloadObject.catName);  // payloadObject.catName
        category.put('short_description__c', payloadObject.description);  // payloadObject.description

        insert category;

        return 'success';
    }

    @AuraEnabled
    public static Boolean deleteVehicleCategory(Id recordId) {
        try {
            Database.delete(recordId);
            return true;
        } catch(Exception e) {
            System.debug(e.getMessage());
        }
        return false;
    }

    @AuraEnabled
    public static Boolean updateVehicleCategory(Id recordId, String catName, String description){
      try{
        System.debug('First Input :'+ catName);
        System.debug('Second Input :'+ description);
        
          Vehicle_Category__c vehicleCat = [SELECT Name, Id, vehicle_category__c, short_description__c FROM Vehicle_Category__c WHERE Id =: recordId];
          vehicleCat.vehicle_category__c = catName;
          vehicleCat.short_description__c = description;
          
          update vehicleCat;
          
          return true;
      } catch(Exception e){
        System.debug('Unable to update the record due to '+e.getMessage());
      }
         return false;
    }


    //Wrapper Class to represent a VehicleCategory Item
  public class VehicleCategory {
    // @AuraEnabled
    // public String Name;
    
    @AuraEnabled
    public String catName;
    @AuraEnabled
    public String description;
    
    // @AuraEnabled
    // public Date todoDate;
    // @AuraEnabled
    // public Boolean done;
  }


  @AuraEnabled
  public static Boolean insertVehicleInfo(String payload){
    try{
    VehicleInfo payloadObject = (VehicleInfo) JSON.deserialize(payload, VehicleInfo.class);
    SObject vehicleinfo = (Sobject) Type.forName('vehicle_info__c').newInstance();

    vehicleinfo.put('registration_number__c', payloadObject.RegistrationNumber);  
    vehicleinfo.put('vehicle_category__c', payloadObject.VehicleCategoryName);  
    vehicleinfo.put('vehicle_company_name__c', payloadObject.VehicleCompanyName);  
    vehicleinfo.put('parking_number__c', payloadObject.ParkingNumber);  
    vehicleinfo.put('owner_name__c', payloadObject.OwnerName);  
    vehicleinfo.put('owner_contact_number__c', payloadObject.OwnerContactNumber);  
    vehicleinfo.put('in_time__c', payloadObject.inTime);  
    
    insert vehicleinfo;
    return true;

    } catch(Exception e) {
        System.debug(e.getMessage());
    }
    return false;   
}


   //Wrapper Class to represent a VehicleInfo Item
   public class VehicleInfo {    
    @AuraEnabled
    public String ParkingNumber;    
    @AuraEnabled
    public String VehicleCategoryName;
    @AuraEnabled
    public String VehicleCompanyName;
    @AuraEnabled
    public String RegistrationNumber;
    @AuraEnabled
    public String OwnerName;
    @AuraEnabled
    public String OwnerContactNumber;
    @AuraEnabled
    public String inTime;
}

}