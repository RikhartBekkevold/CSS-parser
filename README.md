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
      "loc": {                                                              
        "start": {                                                          
          "line": 53,                                                       
          "col": 0                                                          
        },                                                                  
        "end": {                                                            
          "line": 58,                                                       
          "col": 1                                                          
        }                                                                   
      },                                                                    
      "selectors": [                                                        
        {                                                                   
          "type": "SelectorPattern",                                        
          "loc": {                                                          
            "start": {                                                      
              "line": 53,                                                   
              "col": 0                                                      
            },                                                              
            "end": {                                                        
              "line": 53,                                                   
              "col": 16                                                     
            }                                                               
          },                                                                
          "selectors": [                                                    
            {                                                               
              "type": "IdSelector",                                         
              "loc": {                                                      
                "start": {                                                  
                  "line": 53,                                               
                  "col": 0                                                  
                },                                                          
                "end": {                                                    
                  "line": 53,                                               
                  "col": 6                                                  
                }                                                           
              },                                                            
              "name": "about"                                               
            },                                                              
            {                                                               
              "type": "ClassSelector",                                      
              "loc": {                                                      
                "start": {                                                  
                  "line": 53,                                               
                  "col": 7                                                  
                },                                                          
                "end": {                                                    
                  "line": 53,                                               
                  "col": 15                                                 
                }                                                           
              },                                                            
              "name": "visible"                                             
            }                                                               
          ]                                                                 
        },                                                                  
        {                                                                   
          "type": "SelectorPattern",                                        
          "loc": {                                                          
            "start": {                                                      
              "line": 54,                                                   
              "col": 0                                                      
            },                                                              
            "end": {                                                        
              "line": 55,                                                   
              "col": 1                                                      
            }                                                               
          },                                                                
          "selectors": [                                                    
            {                                                               
              "type": "TagSelector",                                        
              "loc": {                                                      
                "start": {                                                  
                  "line": 54,                                               
                  "col": 0                                                  
                },                                                          
                "end": {                                                    
                  "line": 54,                                               
                  "col": 4                                                  
                }                                                           
              },                                                            
              "name": "span"                                                
            }                                                               
          ]                                                                 
        }                                                                   
      ],                                                                    
      "rules": {                                                            
        "type": "Block",                                                    
        "loc": {                                                            
          "start": {                                                        
            "line": 55,                                                     
            "col": 0                                                        
          },                                                                
          "end": {                                                          
            "line": 58,                                                     
            "col": 1                                                        
          }                                                                 
        },                                                                  
        "statements": [                                                     
          {                                                                 
            "type": "Statement",                                            
            "important": true,                                              
            "property": "height",                                           
            "loc": {                                                        
              "start": {                                                    
                "line": 56,                                                 
                "col": 2                                                    
              },                                                            
              "end": {                                                      
                "line": 56,                                                 
                "col": 27                                                   
              }                                                             
            },                                                              
            "value": {                                                      
              "type": "Value",                                              
              "loc": {                                                      
                "start": {                                                  
                  "line": 56,                                               
                  "col": 10                                                 
                },                                                          
                "end": {                                                    
                  "line": 56,                                               
                  "col": 27                                                 
                }                                                           
              },                                                            
              "parts": [                                                    
                {                                                           
                  "type": "Dimension",                                      
                  "loc": {                                                  
                    "start": {                                              
                      "line": 56,                                           
                      "col": 10                                             
                    },                                                      
                    "end": {                                                
                      "line": 56,                                           
                      "col": 15                                             
                    }                                                       
                  },                                                        
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
            "loc": {                                                        
              "start": {                                                    
                "line": 57,                                                 
                "col": 2                                                    
              },                                                            
              "end": {                                                      
                "line": 57,                                                 
                "col": 16                                                   
              }                                                             
            },                                                              
            "value": {                                                      
              "type": "Value",                                              
              "loc": {                                                      
                "start": {                                                  
                  "line": 57,                                               
                  "col": 11                                                 
                },                                                          
                "end": {                                                    
                  "line": 57,                                               
                  "col": 16                                                 
                }                                                           
              },                                                            
              "parts": [                                                    
                {                                                           
                  "type": "Identifier",                                     
                  "loc": {                                                  
                    "start": {                                              
                      "line": 57,                                           
                      "col": 11                                             
                    },                                                      
                    "end": {                                                
                      "line": 57,                                           
                      "col": 15                                             
                    }                                                       
                  },                                                        
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
