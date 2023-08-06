
public with sharing class VehicleInfoController {

    // public VehicleInfoController() {

    // }  

   
    @AuraEnabled
    public static Boolean insertVehicleInfo(String payload){
    try{           
        VehicleInfo payloadObject = (VehicleInfo) JSON.deserialize(payload, VehicleInfo.class);
        SObject vehicleinfo = (Sobject) Type.forName('vehicle_info__c').newInstance();

        vehicleinfo.put('registration_number__c', payloadObject.regNumber);  
        vehicleinfo.put('vehicle_category__c', payloadObject.catName);  
        vehicleinfo.put('vehicle_company_name__c', payloadObject.compName);  
        vehicleinfo.put('parking_number__c', payloadObject.parkNumber);  
        vehicleinfo.put('owner_name__c', payloadObject.custName);  
        vehicleinfo.put('owner_contact_number__c', payloadObject.custContact);  
        vehicleinfo.put('in_time__c', payloadObject.inTime);  
        vehicleinfo.put('status__c', 'In'); 
        
        insert vehicleinfo;
        return true;

        } catch(Exception e) {
            System.debug(e.getMessage());
        }
        return false;   
    }

    @AuraEnabled
    public static Boolean updateVehicleInfo(Id recordId, Integer totalCharges, String remarks, String outTime){
      try{
        // System.debug('First Input :'+ catName);
        // System.debug('Second Input :'+ description);
        
        vehicle_info__c vehicleInfo = [SELECT Name, Id, parking_charge__c, remark__c, status__c, out_time__c FROM vehicle_info__c WHERE Id =: recordId];
        vehicleInfo.parking_charge__c = totalCharges;
        vehicleInfo.remark__c = remarks;
        vehicleInfo.out_time__c = outTime;
        vehicleInfo.status__c = 'Out';
        
        update vehicleInfo;
          
          return true;
      } catch(Exception e){
        System.debug('Unable to update vehicle info record due to '+e.getMessage());
      }
         return false;
    }

    @AuraEnabled(cacheable=true)
    public static List<vehicle_info__c> getVehicleInfo(String status){

        List<vehicle_info__c> vehicleInfoList = 
        [SELECT registration_number__c,
        vehicle_category__c,
        vehicle_company_name__c,
        parking_number__c,
        owner_name__c,
        owner_contact_number__c,
        in_time__c,
        out_time__c,
        parking_charge__c,
        remark__c,
        status__c FROM vehicle_info__c WHERE status__c =: status];

        return vehicleInfoList;                     
    }


    @AuraEnabled(cacheable=true)
    public static List<vehicle_info__c> getVehicleInfoAll(){
        
        List<vehicle_info__c> vehicleInfoList = 
        [SELECT registration_number__c,
        vehicle_category__c,
        vehicle_company_name__c,
        parking_number__c,
        owner_name__c,
        owner_contact_number__c,
        in_time__c,
        out_time__c,
        parking_charge__c,
        remark__c,
        status__c FROM vehicle_info__c];

        return vehicleInfoList;              
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getCountVehicleInOut(){
        List<AggregateResult> vehicleInOut = 
        [SELECT Count(Id), status__c 
                FROM vehicle_info__c 
                GROUP BY status__c];
                
        return vehicleInOut;
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getRevenueByCategory(){
        List<AggregateResult> categoryRevenueList = 
        [SELECT SUM(parking_charge__c), vehicle_category__c
        FROM vehicle_info__c 
        GROUP BY vehicle_category__c];

        return categoryRevenueList;
    }


    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getCountVehicleCategory(){        
        List<AggregateResult> vehicleInfoList = 
        [SELECT COUNT(Id), 
               vehicle_category__c 
               FROM vehicle_info__c 
               GROUP BY vehicle_category__c];

        // [SELECT registration_number__c,
        // vehicle_category__c,
        // vehicle_company_name__c,
        // parking_number__c,
        // owner_name__c,
        // owner_contact_number__c,
        // in_time__c,
        // out_time__c,
        // parking_charge__c,
        // remark__c,
        // status__c FROM vehicle_info__c]; SELECT Count(Id), status__c FROM vehicle_info__c GROUP BY status__c

        return vehicleInfoList;              
    }

    @AuraEnabled
    public static Boolean deleteVehicleInfo(Id recordId) {
        try {
            Database.delete(recordId);
            return true;
        } catch(Exception e) {
            System.debug(e.getMessage());
        }
        return false;
    }
   
    // {"regNumber":"Sa33","compName":"vfrt","catName":"wheel","custName":"Sant","custContact":"1234567890"}
  //Wrapper Class to represent a VehicleInfo Item
  public class VehicleInfo {    
    @AuraEnabled
    public String parkNumber;    
    @AuraEnabled
    public String catName;
    @AuraEnabled
    public String compName;
    @AuraEnabled
    public String regNumber;
    @AuraEnabled
    public String custName;
    @AuraEnabled
    public String custContact;
    @AuraEnabled
    public String inTime;
}


// Id
// registration_number__c
// vehicle_category__c
// vehicle_company_name__c
// parking_number__c
// owner_name__c
// owner_contact_number__c
// in_time__c
// out_time__c
// parking_charge__c
// remark__c
// status__c

}