
const wd = require('wd'); 
const driver = wd.promiseChainRemote("http://localhost:4723/wd/hub"); 
const caps = { 
    "deviceName": "Pixel 3 API 29", 
    "uuid": "emulator-5554", 
    "platformName": "Android", 
    "platformVersion": "10.0", 
    "appPackage": "org.zwanoo.android.speedtest", 
    "appActivity": "com.ookla.mobile4.screens.main.MainActivity" 
};
var hrstart = process.hrtime() //start the time to measure exectuion time

async function main() {
    
    await driver.init(caps); //Initalize the driver with the desired capabilities that are configured for Appium

    //This block of code simulates a button press for the premission settings when the app's main activity is called upon.
    //it consists of 3 different screens and 5 button taps. 
    //It is calling the click function will passing it the elements ID
    click("org.zwanoo.android.speedtest:id/welcome_message_next_button");
    click("org.zwanoo.android.speedtest:id/permissions_continue_button");
    click("com.android.permissioncontroller:id/permission_allow_button");
    click("com.android.permissioncontroller:id/permission_allow_always_button");
    click("org.zwanoo.android.speedtest:id/enable_bg_sampling_allow_button");

    //This block is for the actual speed test itself. It is calling the same click function with the GO Elements ID
    click("org.zwanoo.android.speedtest:id/go_button");

    //This function waits till the speed test is done and grabs the Upload, Download, and Ping speeds and displays them to the console. 
    await showResults();

    var hrend = process.hrtime(hrstart) //end time for exectuion 
    console.info('Execution time: %ds ', hrend[0]);
   

    
}

function click(id){
    return driver.waitForElementById(id, 10000, 100) //waits for an element to be present in the DOM and then returns a promise of it being clicked. 
        .then(function (el) {
            return el.click();
        });
}

function showResults(){

    //waits for the suite-completed element to show beacuse the indicates that the test has completed. 
    //Once  it has been located we then have to look for the Upload, Download, and Ping elements and derive their text. 

    return driver.waitForElementById("org.zwanoo.android.speedtest:id/suite_completed_layout_top", 70000, 100) 
    .then(function(el){
        
        driver.elementByXPath("//android.widget.FrameLayout[@content-desc=\"UPLOAD\"]/android.view.ViewGroup/android.widget.TextView[3]")
        .text()
        .then(function(upload_speed){
            console.log("Upload Speed: " + upload_speed);
            // return text;
        });
        driver.elementByXPath("//android.widget.FrameLayout[@content-desc=\"DOWNLOAD\"]/android.view.ViewGroup/android.widget.TextView[3]")
        .text()
        .then(function(download_speed){
            console.log("Download Speed: " + download_speed);
        });
        driver.elementByXPath("//android.view.ViewGroup[@content-desc=\"Ping\"]/android.view.ViewGroup/android.widget.TextView[2]")
        .text()
        .then(function(ping){
            console.log("Ping: " + ping);
        });

        return el;
      
    });

}


main().catch(console.log);


