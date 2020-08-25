# CSS parser
Parses CSS into an Abstract Syntax Tree

## In
```css
#about .visible,
span
{
  height: 100px !important;
  display: flex;
}
```

## Out
```
{                                         
  "type": "Stylesheet",                   
  "rules": [                              
    {                                     
      "type": "StyleRule",                
      "selectors": [                      
        {                                 
          "type": "Selector",             
          "children": [                   
            {                             
              "type": "IdSelector",       
              "name": "about"             
            },                            
            {                             
              "type": "ClassSelector",    
              "name": "visible"           
            }                             
          ]                               
        },                                
        {                                 
          "type": "Selector",             
          "children": [                   
            {                             
              "type": "TagSelector",      
              "name": "span"              
            }                             
          ]                               
        }                                 
      ],                                  
      "rules": {                          
        "type": "Block",                  
        "statements": [                   
          {                               
            "type": "Statement",          
            "important": true,            
            "property": "height",         
            "value": {                    
              "type": "Value",            
              "parts": [                  
                {                         
                  "type": "Dimension",    
                  "val": "100",           
                  "unit": "px"            
                }                         
              ]                           
            }                             
          },                              
          {                               
            "type": "Statement",          
            "important": false,           
            "property": "display",        
            "value": {                    
              "type": "Value",            
              "parts": [                  
                {                         
                  "type": "Identifier",   
                  "name": "flex"          
                }                         
              ]                           
            }                             
          }                               
        ]                                 
      }                                   
    }                                     
  ]                                       
}                                         
```
