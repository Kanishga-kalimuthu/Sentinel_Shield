#include <Wire.h>
#include <hd44780.h>
#include <hd44780ioClass/hd44780_I2Cexp.h>

hd44780_I2Cexp lcd;
#include<WiFi.h>
#include <WiFiClient.h>
#include <HTTPClient.h>


#define u1_triger_high  digitalWrite(12,HIGH)
#define u1_triger_low   digitalWrite(12,LOW)
#define ultra1 14

#define u1_triger_high2  digitalWrite(27,HIGH)
#define u1_triger_low2   digitalWrite(27,LOW)
#define ultra2 26


WiFiClient client;
HTTPClient http;

const char *ssid =  "iot";
const char *pass =  "iot12345";
int sec=0,u1,u2,at=0,att=0,tt=0;
unsigned long previousMillis = 0;        // will store last time LED was updated
const long interval = 1000;
int sw=19;
int vib=25;
int Alarm=13;

unsigned char i=0,j=0,ii=0,ss=0;

int mappedValue1,mappedValue2;
long duration;
float distance;
float prev_level = 0;

void Lcd_Decimal3(unsigned char com, unsigned char com1, unsigned int val);
void Lcd_Decimal2(unsigned char com, unsigned char com1, unsigned int val);
void serial_Decimal3(unsigned char val);
void http_send1();
String  data1 = "";
String  data2 = "";  
void setup() {
  // put your setup code here, to run once:
  pinMode(Alarm, OUTPUT);
  digitalWrite(Alarm, LOW);
  Serial.begin (9600);
  
 pinMode(12, OUTPUT);
 pinMode(14, INPUT);
 pinMode(27, OUTPUT);
 pinMode(26, INPUT);
  pinMode(sw, INPUT_PULLUP);
  pinMode(vib, INPUT);
  
  Serial.println("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Netmask: ");
  Serial.println(WiFi.subnetMask());
  Serial.print("Gateway: ");
  Serial.println(WiFi.gatewayIP());

  Serial.println("cONNECT1111");
  lcd.begin(16, 2);
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.print("----------------");
  lcd.setCursor(0,1);
  lcd.print("----------------");delay(2000);
  lcd.clear();
 
}

void loop() {
unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    sec++;
  }
   if(sec>3)
   {http_send1();sec=0;}
   
  u1 = read_ultrasonic1();
  u2 = read_ultrasonic2();
  mappedValue1 = map(u1, 0, 12, 100, 0); // Multiply by 10 to use int with map()
  if(mappedValue1<=0){mappedValue1=0;}
   
  lcd.setCursor(0,0);
  lcd.print("Fuel:");
  lcd.setCursor(5,0);
  lcd.print(mappedValue1);lcd.print("% ");
  lcd.setCursor(9,0);
  lcd.print("Dis:");
  Lcd_Decimal3(13,0,u2);

  if(digitalRead(sw)==LOW)
  {lcd.setCursor(0,1);
  lcd.print("V:ON  ");att=1;}
  else{lcd.setCursor(0,1);
  lcd.print("V:OFF ");att=0;}
  

  if(digitalRead(vib)==HIGH && att==0)
  {lcd.setCursor(6,1);ss=3;
  lcd.print("VIB DETECT");data1="VIBRATION_DETECT";
  digitalWrite(Alarm, HIGH);
  if(tt==0){http_send1();delay(2000);tt=1;}
  }
  
  else if (prev_level != 0 && (prev_level - mappedValue1) > 5 && att==0) 
  {
  ss=2;
  lcd.setCursor(6,1);
  lcd.print("FUEL THEFT");data1="FUEL_THEFT";
  digitalWrite(Alarm, HIGH);
  if(tt==0){http_send1();delay(2000);tt=1;}
  }
  else if(u2<20 && att==0)
  {
  ss=1;
  lcd.setCursor(6,1);
  lcd.print("PERSON DET"); data1="PERSON_DETECT";
  digitalWrite(Alarm, HIGH);
  if(tt==0){http_send1();delay(2000);tt=1;}
  }
  
  else
  {
  ss=0;tt=0;
  lcd.setCursor(6,1); data1="NORMAL";
  lcd.print("  NORMAL  ");digitalWrite(Alarm, LOW);
  }
  prev_level = mappedValue1;
}
unsigned int read_ultrasonic1()
{
  int ultrasonic=0;
  u1_triger_low;delay(1);
  u1_triger_high;
  delay(10);
  u1_triger_low;
  ultrasonic=pulseIn(ultra1,HIGH)/56.0;
  return ultrasonic;
 }
 unsigned int read_ultrasonic2()
  {
  int ultrasonic1=0;
  u1_triger_low2;delay(1);
  u1_triger_high2;
  delay(10);
  u1_triger_low2;
  ultrasonic1=pulseIn(ultra2,HIGH)/56.0;
  return ultrasonic1;
 }
void Lcd_Decimal4(unsigned char com,unsigned char com1,unsigned int val) 
{
  unsigned int Lcd_th,Lcd_thr,Lcd_h,Lcd_hr,Lcd_t,Lcd_o;
  lcd.setCursor(com,com1);
  val = val%10000;
  Lcd_th=val/1000;
  Lcd_thr=val%1000;
  Lcd_h=Lcd_thr/100;
  Lcd_hr=Lcd_thr%100;
  Lcd_t=Lcd_hr/10;
  Lcd_o=Lcd_hr%10;

  lcd.setCursor(com,com1);
  lcd.write(Lcd_th+0x30);
  lcd.setCursor(com+1,com1);
  lcd.write(Lcd_h+0x30);
  lcd.setCursor(com+2,com1);
  lcd.write(Lcd_t+0x30);
  lcd.setCursor(com+3,com1);
  lcd.write(Lcd_o+0x30);
}
void Lcd_Decimal3(unsigned char com,unsigned char com1,unsigned int val)
  {
      unsigned int Lcd_h,Lcd_hr,Lcd_t,Lcd_o;
      lcd.setCursor(com,com1);
      Lcd_h=val/100;
      Lcd_hr=val%100;
      Lcd_t=Lcd_hr/10;
      Lcd_o=Lcd_hr%10;
    
      lcd.setCursor(com,com1);
      lcd.write(Lcd_h+0x30);
      lcd.setCursor(com+1,com1);
      lcd.write(Lcd_t+0x30);
      lcd.setCursor(com+2,com1);
      lcd.write(Lcd_o+0x30);
  }
 
void http_send1()
{ 
 if (WiFi.status() == WL_CONNECTED) {
      WiFiClient client;
      HTTPClient http;
      String url = String("http://10.186.120.106:5000/energy?machine_id=1") +
             "&Fuel=" + String(mappedValue1) +
             "&Distance=" + String(u2) +
             "&anomaly=" + String(data1);
    http.begin(client, url);
      int httpCode = http.GET();   //Send the request
      String data = http.getString();    //Get the response data
      Serial.println(data);    //Print request response data
      http.end(); delay(100);
    
}
}

  void serial_Decimal3(unsigned char val)
  {
      unsigned int Lcd_h,Lcd_hr,Lcd_t,Lcd_o;
      Lcd_h=val/100;
      Lcd_hr=val%100;
      Lcd_t=Lcd_hr/10;
      Lcd_o=Lcd_hr%10;
    
      
      Serial.write(Lcd_h+0x30);
     // Serial.write('.');
      Serial.write(Lcd_t+0x30);
      Serial.write(Lcd_o+0x30);
  }
