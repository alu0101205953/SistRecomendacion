# Sistemas de Recomendación

## - Descripción del código desarrollado

Este código ha sido desarrollado empleando Javascript y HTML. En primer lugar, en el fichero _index.html_ se encuentra el código con la estructura principal de la página, con los desplegables y formularios a rellenar, y el botón que activa el manejador de eventos que realiza los cálculos pertinentes.

En cuanto al código Javascript, en primer lugar encontramos dos funciones asociadas al botón que permite abrir un archivo y procesar el texto del mismo, gestionando aquellos casos en los que la matriz contenga espacios en blanco, etc. y construyendo un array sobre el que se trabajará con las siguientes funciones.

![Funcion 1](https://i.imgur.com/XZE8Yzr.png)
![Funcion 2](https://i.imgur.com/6A9m4t2.png)

A continuación, la función principal del programa, será la encargada de llamar a las distintas funciones que permiten calcular la matriz de similitud y la predicción en función de los parámetros escogidos por el usuario:

![Funcion 3](https://i.imgur.com/CGanDTo.png)

LA primera de ellas toma como parámetros la matriz de utilidad y la métrica a emplear y calcula la matriz de similitud, teniendo en cuenta que evaluar la similitud de un usuario consigo mismo no tiene sentido, y omitiéndolo por tanto. En función de la métrica escogida, se emplean distintas funciones específicas para cada una de ellas:

- Correlación de Pearson:
 
![Funcion 4](https://i.imgur.com/RCsnaXv.png) 
 
- Distancia Coseno:

![Funcion 5](https://i.imgur.com/UvivheZ.png) 

- Distancia Euclídea:

![Funcion 6](https://i.imgur.com/agjOIEv.png) 

Por último, formatea esa matriz calculada en una tabla para mostrarla en la página.

En la segunda función, se calcula la predicción de las calificaciones de los usuarios habiendo con la matriz de similitud obtenida y en función de la predicción y número de vecinos elegidos por el usuario. En primer lugar ordena y trunca la matriz de similitud en función de los parámetros elegidos por el usuario mediante una función escrita aparte. 

![Funcion 7](https://i.imgur.com/jovXyOs.png)

A continuación aplica la fórmula pra la predicción teniendo en cuenta que pueden existir items no calificados por los vecinos más cercanos y omitiéndolos en tal caso, y redondeando la calificación en caso de que sea inferior a 0 o superior a 5. Además se formatea la matriz y se muestra en la página, junto con los usuarios empleados para realizar la predicción en cada caso.

![Funcion 8](https://i.imgur.com/bteoD8S.png)


## - Ejemplo de uso

Para hacer uso del programa basta con seleccionar un archivo que contenga una matriz de utilidad y rellenar el formulario con los parámetros deseados:

![Imagen formulario 1](https://i.imgur.com/mgIqPrQ.png)
