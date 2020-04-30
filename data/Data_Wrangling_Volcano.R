library(tidyverse)
library(sf)
library(leaflet)
library(stringr)

setwd("~/UPENN/Box Sync/4th_SEMESTER/Javascript/Harth_Leo_Javascript_Final/data")

holo <- read.csv("GVP_Volcano_List_Holocene.csv")
pleisto <- read.csv("GVP_Volcano_List_Pleistocene.csv")

s <- function (x) {summary(as.factor(x))}

s(holo$Country)

unique(holo$Country)
unique(pleisto$Country)

colnames(holo) == colnames(pleisto)

holo$Epoch <- "Holocene"
pleisto$Epoch <- "Pleistocene"

volcano <- rbind(holo, pleisto) %>% 
  rename(
    Name = Volcano.Name,
    Type = Primary.Volcano.Type,
    Activity_evidence = Activity.Evidence,
    Last_known_eruption = Last.Known.Eruption,
    Elevation_meters = Elevation..m.,
    Dominant_rock_type = Dominant.Rock.Type
  )

unique(volcano$Country)

sum(is.na(volcano$Latitude))
sum(is.na(volcano$Longitude))

s(volcano$Type)
typeof(volcano$Type)
volcano$Type <- as.character(volcano$Type)

volcano$Type <- case_when(
  volcano$Type == "Caldera(s)" ~ "Caldera",
  volcano$Type == "Complex(es)" ~ "Complex",
  volcano$Type == "Cone(s)" ~ "Cone",
  volcano$Type == "Explosion crater(s)" ~ "Explosion crater",
  volcano$Type == "Fissure vent(s)" ~ "Fissure vent",
  volcano$Type == "Lava cone(es)" ~ "Lava cone",
  volcano$Type == "Lava cone(s)" ~ "Lava cone",
  volcano$Type == "Lava dome(s)" ~ "Lava dome",
  volcano$Type == "Maar(s)" ~ "Maar",
  volcano$Type == "Pyroclastic cone(s)" ~ "Pyroclastic cone",
  volcano$Type == "Shield(s)" ~ "Shield",
  volcano$Type == "Stratovolcano(es)" ~ "Stratovolcano",
  volcano$Type == "Stratovolcano?" ~ "Stratovolcano",
  volcano$Type == "Submarine(es)" ~ "Submarine",
  volcano$Type == "Tuff cone(s)" ~ "Tuff cone",
  volcano$Type == "Tuff ring(s)" ~ "Tuff ring",
  volcano$Type == "Caldera(?)" ~ "Caldera",
  volcano$Type == "Explosion crater(?)" ~ "Explosion crater",
  volcano$Type == "Fissure vent(s) ?" ~ "Fissure vent",
  volcano$Type == "Lava dome(s) ?" ~ "Lava dome",
  volcano$Type == "Shield?" ~ "Shield",
  TRUE ~ volcano$Type
)

s(volcano$Last_known_eruption)
volcano$Last_known_eruption[is.na(volcano$Last_known_eruption)] <- "Unknown"
volcano$Last_known_eruption <- as.character(volcano$Last_known_eruption)

s(volcano$Activity_evidence)

volcano$Activity_evidence <- as.character(volcano$Activity_evidence)
volcano$Activity_evidence <- if_else(is.na(volcano$Activity_evidence), "No_information", volcano$Activity_evidence)

s(volcano$Region)

s(volcano$Subregion)

summary(volcano$Elevation_meters)

s(volcano$Dominant_rock_type)
typeof(volcano$Dominant_rock_type)
volcano$Dominant_rock_type <- as.character(volcano$Dominant_rock_type)
volcano$Dominant_rock_type[volcano$Dominant_rock_type == "No Data (checked)"] <- "No_information"
volcano$Dominant_rock_type[is.na(volcano$Dominant_rock_type)] <- "No_information"
volcano$Dominant_rock_type[volcano$Dominant_rock_type == ""] <- "No_information"

str(volcano)

volcano$Name <- as.character(volcano$Name)
volcano$Country <- as.character(volcano$Country)
volcano$Region <- as.character(volcano$Region)
volcano$Subregion <- as.character(volcano$Subregion)

volcano$join_id <- row.names(volcano)

volcano_filtered <- filter(volcano, volcano$Last_known_eruption != "Unknown")

volcano_filtered$split_field <- str_split_fixed(volcano_filtered$Last_known_eruption, " ", 2)

volcano_filtered$Era_last_eruption <- volcano_filtered$split_field[, 2]
volcano_filtered$Year_last_eruption <- volcano_filtered$split_field[, 1]

volcano_filtered$Year_last_eruption <- as.double(volcano_filtered$Year_last_eruption)
volcano_filtered$Year_last_eruption <- if_else(volcano_filtered$Era_last_eruption == "BCE",
                                               volcano_filtered$Year_last_eruption*-1,
                                               volcano_filtered$Year_last_eruption)
summary(volcano_filtered$Year_last_eruption)

volcano_filtered <- volcano_filtered %>% 
  select(join_id, Year_last_eruption)

volcano <- left_join(volcano, volcano_filtered, by = "join_id")
remove(volcano_filtered, holo, pleisto)

volcano$Register_last_eruption <- if_else(volcano$Last_known_eruption == "Unknown", "No", "Yes")
s(volcano$Register_last_eruption)

colnames(volcano)
volcano <- volcano %>% 
  dplyr::select(-join_id, -Last_known_eruption)

# volcano_sf <- st_as_sf(volcano, coords = c("Longitude", "Latitude"), crs = 4326)

# m <- leaflet(data = volcano_sf) %>%
#   addTiles() %>%
#   addMarkers()
# 
# m

# library(jsonlite)
# write_json(volcano, "volcano.json")
# 
# st_write(volcano_sf, "volcano_sf.geojson", driver = "geojson")

ggplot(data = volcano_test) +
  geom_histogram(aes(Elevation_meters), bins = 100)
