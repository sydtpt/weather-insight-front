/**
 * This file contains unit tests for the CardTempDayComponent.
 * The CardTempDayComponent is responsible for displaying the temperature for a specific day in a card format.
 * It uses the ForecastResponse model to retrieve the temperature data.
 * The tests verify that the getTemp() method returns the correct temperature, rounded to the nearest whole number.
 */
import { TestBed } from '@angular/core/testing';
import { CardTempDayComponent } from './card-temp-day.component';
import { ForecastResponse } from '../../models/forecast-response.model';

describe('CardTempDayComponent', () => {
  let component: CardTempDayComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Provide any necessary dependencies for your component here
    });

    component = TestBed.inject(CardTempDayComponent);
  });

  it('should return the correct temperature', () => {
    const mockForecast = createRandomMockForecastResponse();
    // Act
    const temperature = parseInt(component.getTemp());

    // Assert
    expect(temperature).toBe(mockForecast.current.temperature_2m); // The temperature should be rounded to the nearest whole number
  });

  it('should return the correct temperature when the temperature is zero', () => {
    const mockForecast = createRandomMockForecastResponse();
    mockForecast.current.temperature_2m = -0.0001;
    // Act
    const temperature = parseInt(component.getTemp());

    // Assert
    expect(temperature).toBe(0); // The temperature should be rounded to the nearest whole number
  });

  it('should return the correct temperature when the temperature is positive', () => {
    const mockForecast = createRandomMockForecastResponse();
    mockForecast.current.temperature_2m = 5.8;
    // Act
    const temperature = parseInt(component.getTemp());

    // Assert
    expect(temperature).toBe(6); // The temperature should be rounded to the nearest whole number
  });

  it('should return the correct temperature when the temperature is negative', () => {
    const mockForecast = createRandomMockForecastResponse();
    mockForecast.current.temperature_2m = -5.8;
    // Act
    const temperature = parseInt(component.getTemp());

    // Assert
    expect(temperature).toBe(-6); // The temperature should be rounded to the nearest whole number
  });

  it('should return the correct temperature when the temperature is a decimal', () => {
    const mockForecast = createRandomMockForecastResponse();
    mockForecast.current.temperature_2m = 5.8;
    // Act
    const temperature = parseInt(component.getTemp());

    // Assert
    expect(temperature).toBe(6); // The temperature should be rounded to the nearest whole number
  });

});


// create a function to create a fake forecast response
function createRandomMockForecastResponse() {
  const randomNumber = Math.floor(Math.random() * 100);
  const randomDate = new Date();
  const randomWeatherCode = Math.floor(Math.random() * 100);
  const randomWindDirection = Math.floor(Math.random() * 100);
  const randomWindGust = Math.floor(Math.random() * 100);
  const randomWindSpeed = Math.floor(Math.random() * 100);

  // create a new mock forecast response
  const mockForecast: ForecastResponse = {
    current: {
      temperature_2m: randomNumber,
      apparent_temperature: randomNumber,
      cloud_cover: randomNumber,
      interval: randomNumber,
      is_day: true,
      precipitation: randomNumber,
      pressure_msl: randomNumber,
      rain: randomNumber,
      relative_humidity_2m: randomNumber,
      showers: randomNumber,
      snowfall: randomNumber,
      surface_pressure: randomNumber,
      time: randomDate,
      weather_code: randomWeatherCode, // Add the missing property
      wind_direction_10m: randomWindDirection, // Add the missing property
      wind_gusts_10m: randomWindGust, // Add the missing property
      wind_speed_10m: randomWindSpeed, // Add the missing property
    },
    daily: {
      apparent_temperature_max: [randomNumber], // Add the missing property
      apparent_temperature_min: [0], // Add the missing property
      sunrise: [new Date()], // Add the missing property
      sunset: [new Date()], // Add the missing property
      temperature_2m_max: [randomNumber], // Add the missing property
      temperature_2m_min: [randomNumber], // Add the missing property
      time: [new Date()], // Add the missing property
      temperature_2m_mean: [randomNumber], // Add the missing property
      apparent_temperature_mean: [randomNumber], // Add the missing property
    },
  };

  // return the mock forecast response
  return mockForecast;
}