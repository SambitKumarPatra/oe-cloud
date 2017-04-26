/*
©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
/**
* @classdesc This model stores the data for navigation-links in UI
* The model has following properties
* <pre>
* Property   |              Description
* -----------|-------------------------------
* `name`     | link name
* `url`      | url to navigate to
* `label`    | display label for navigation link. This can also be 'Literal' key.
* `icon`     | If specified, an icon is displayed next to label
* `topLevel` | Boolean value that specified if this link is a root level link or child of another link
* `parent`   | Name of the parent link. UI components can use this hierarchical data to navigate progressively or display a tree structure of navigation link.
* </pre>
*
* @kind class
* @class NavigationLink
* @author Rohit Khode
*/
