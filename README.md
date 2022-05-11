

# Illustrative Visualization Final Project - Scatter plot

### Shahin Doroudian - Zekun Wu

In this final project we build an interactive scatterplot that animates changes over time. We focus on the dataset on Foodborne Disease Outbreaks, recreating the "bubble plot" based on the illness for different area in US. We used <a href="https://www.kaggle.com/code/emonte/pattern-of-food-borne-disease-outbreaks/data">this</a> dataset and mapped the data to a scatter plot. 

### Data Analytics:  
The focus of our project is to explore the change of the food born disease in different US states within a certain time range. Specifically, we are very interested in the potential correlation between states in such a change. We use two different ways to visual such correlation: the geo proximity and the statistical cluster. For geo proximity, all the states are classified based on six different time zones and states in the same color are supposed to be close to each other in geo sense. For the statistical cluster, we use the K-means to cluster all the states with their hospitalization, fatality and illnesses number.

### Chart:   
The scatter plot itself is developed by d3. User can browse through the data and change the year using a slider at the bottom of the chart. By pressing the Play button, the chart automatically goes through the years one by one to simulate a storytelling plot. In order to show the details of each bubble, users can mouse-over each bubble, a tooltip will pop up displaying the details. There is also a legend on the bottom showing the selected year. The chart also goes over a transition to show the new bubbles after changing the data.

In the visualization part, we use different colors to indicate states from different time zones (CTZ, ADTZ, MTZ, PTZ, ETZ and PTZ) and each state is presented with a bubble in the chart. The bubble size is determined by the illness number. In the plot, each bubble's position is indicated in a hospitalization to fatality coordinates. Generally speaking, the bubbles close to the right-upper position are considered as the states with severe foodborne disease.

<p align="center">
  <img src="img/pic01.gif">
</p>