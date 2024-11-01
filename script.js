import mongoose from 'mongoose';
import Biography from './Models/Biogrphies/biography.js';


const addHeartField = async () => {
    try {
        // Connect to the database
        await mongoose.connect('mongodb+srv://professionalsspotlight:HqSVeGhuWCwIwzQE@cluster0.np1qy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Update all existing biographies to add the heart field
        const result = await Biography.updateMany(
            {},
            { $set: { heart: false } } // Set the heart field to false
        );

        console.log(`Updated ${result.modifiedCount} biographies.`);
    } catch (error) {
        console.error("Error updating biographies:", error);
    } finally {
        mongoose.connection.close(); // Close the connection
    }
};

addHeartField();
