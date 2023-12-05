# SG-Blocks
App inspired by Java Block but in online version :D
## Version: Alpha 1.1
### Controls
Move Blocks - Left Click Mouse
Connect - Right Click Mouse Drag from block to block
Remove Connect - Hold CTRL and click on line

### In console
run() - to run algoritm
new OutputBlock(x, y, message, isVariable)
* x - x position
* y - y postion
* message - Console Log Message
* isVariable - information if value is variable or just a value
new InputBlock(x, y, variableName, message)
* variableName - name of Variable
* message - Message that shows when you have to type variable value
new ConditionBlock(x, y, value1, value2, condition, isValue1Variable, isValue2Variable)
* value1 - value no.1 to compare
* value2 - value no.2 to compare
* condition - type of condition (only "==" at the moment)
* isVariable1Variable - information if value no.1 is variable or just a value
