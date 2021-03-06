# About Atomic Design

Atomic design ([atomicdesign.bradfrost.com/](http://atomicdesign.bradfrost.com/)) is an approach to build the pages 
for your web application with the goal to build a "design system" with clear defined and reusable components.

Atomic design distinguishes between the following "atomic design elements": atoms, molecules, organism, templates and pages.

## Element Details

*   atom: 
    *   **atoms of our interfaces serve as the foundational building blocks that comprise all our user interfaces**
    *   Smallest unit - should not be composed itself of smaller units
    *   Example: a Button, a Label, an Input Field
*   molecule
    *   **molecules are relatively simple groups of UI elements functioning together as a unit**
    *   Example: searchbox with input and button
*   organism
    *   **Organisms are relatively complex UI components composed of groups of molecules and/or atoms and/or other organisms**
    *   example: complex slider, menu structure
*   **template:**
    *   **Templates are page-level objects that place components into a layout and articulate the design’s underlying content structure.**
    *   They provide context for these relatively abstract molecules and organisms
    *   focus on the page’s underlying content structure rather than the page’s final content
*   **page**
    *   **Pages are specific instances of templates that show what a UI looks like with real representative content in place**

## Dependency Rules

### Public and Private Molecules

*   The first directory level is considered the main design system and includes public elements
*   Each element may have a second directory level, which can be used to define private elements
    *   Private elements help to keep an overview on big websites
    *   Its not allowed to use private elements from other first level elements (they only belong to the parent element)
*   It is good to have private elements
    *    especially under templates and pages that helps having an overview and not to "pollute" the public elements with elements that are anyhow just intended to be used on THAT template or THAT page

### Dependency Rules

Only higher level elements are allowed to include or use lower level elements:

Overview:

![](atomic-design-structure.png)

### Example structure:


*   atom
    *   button
    *   price
*   molecule
    *   pagination
    *   searchbar
*   organism
    *   productwidget
*   template
    *   base
        *   molecule
            *   header  (private to the template)
            *   footer  (private to the template)
    *   checkout (template for checkout, extends template/base)
        *   molecule
            *   stepnavigation (private to the template)
*   page
    *   home  (e.g. use template/base)
    *   product (e.g. use template/base)
    *   checkout (e.g. use template/checkout)

### Rules

*   Each element should live in a DIRECTORY, the directory name matches the element name
    *   The directory contains the definitions in separate files:
        *   elementname.pug    (for html)
        *   elementname.saas   (for the styles)
        *   ....js

*   CSS should be bounded to the element:
    *   elementname.pug should define a top level element with a classname matching the element name
    *   elementname.saas 
        *   should use this classname as a parent, so that the defined styles matches the element
        *   it should not rely on parent classes in other elements NOR should it modify styles from included sub-elements

*   Templates
    *   Should use "block" definitions to define the content structure
*   **No other public element (atom, molecule or organism) should define blocks**
*   Atom, Molecule, Organism:
    *   Should never rely on data passed to pages
    *   Instead if they support dynamic data, they MUST use a mixin and define and document a use case oriented data structure that needs to be passed
