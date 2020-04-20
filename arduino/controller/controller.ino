String command;

void setup() {
  Serial.begin(9600);

  pinMode(13,OUTPUT); 
}

void loop() {
  if(Serial.available())
  {
    command = Serial.readStringUntil('\n');

    if(command.equals("on"))
    {
      digitalWrite(13, HIGH);
    }
    else if(command.equals("off"))
    {
      digitalWrite(13, LOW);
    }
    else
    {
      Serial.println("Invalid command");
    }
  }
}
