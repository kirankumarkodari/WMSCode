using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;

namespace WMS
{
    public static class GlobalVariables
    {
        /* Debug Related Paths */
        public static string BaseDirectory_Debug = @"D:\CamImages\";
        public static string BaseDirectoryTimelapse_Debug = @"D:\Timelapse_Vedios\";
        public static string ImproperImagesDirectory_Debug= @"D:\ImproperData";
        public static string RelativeDirectory_Debug = "CamImages\\";
        public static string TimelapseRelativeDirectory_Debug = "Timelapse_Vedios\\";
        public static string ConfigurationFilePath_Debug = @"D:\Configdata.XML";

        /* Release Related Paths */
        public static string BaseDirectory_Release = @"D:\IOT\RWM\WMS DeploymentRD\OnlineImages\";
        public static string BaseDirectoryTimelapse_Release = @"D:\IOT\RWM\WMS DeploymentRD\Timelapse_Vedios\";
        public static string ImproperImagesDirectory_Release = @"D:\IOT\RWM\WMS DeploymentRD\";
        public static string RelativeDirectory_Release = "OnlineImages\\";
        public static string TimelapseRelativeDirectory_Release = "Timelapse_Vedios\\";
        public static string ConfigurationFilePath_Release = @"D:\IOT\RWM\WMS DeploymentRD\Configurations\Configdata.XML";

        /* Camera Existed or Not Idicating vars */
        public static string OffLine = "0";
        public static string OnLine = "1";

        public static string ImageExtension = ".jpg";
        public static string VideoExtension = ".ogg";
        public static int MaxMinutesoConsiderOffLine = 5;


        /* Camera Configuration */
        public static string CameraIMSIAlreadyExists = "303";
        public static string FailedToAddCamera = "505";
        public static string FailedToUpdateCamera = "606";
        public static string FailedToDeleteCamera = "707";
        public static string SuccessCode = "200";


        public static string Camera_string = "Camera-";
        public static string First_Camera_numberpart = "001";
    }
}